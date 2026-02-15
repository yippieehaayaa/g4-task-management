import type { ServerResponse } from "node:http";
import { createLogger } from "@g4/logger";
import type { RequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "../config";
import { ServiceUnavailableError } from "../errors";
import { getOrCreateBreaker } from "./circuitBreaker";
import type { ServiceConfig } from "./registry";

const log = createLogger({ service: "api-gateway", module: "proxy" });

/**
 * Creates a reverse proxy middleware for a downstream service.
 *
 * Best practices applied:
 *  1. Circuit breaker — rejects requests when the upstream is unhealthy
 *  2. Request ID propagation — forwards X-Request-ID to upstream
 *  3. Timeout — configurable per-service request timeout
 *  4. Path rewriting — strips the service prefix before forwarding
 *  5. Error handling — returns structured 502 on proxy failures
 *  6. No body parsing — requests are streamed as-is (avoids unnecessary
 *     serialization overhead and content-length mismatches)
 */
const createServiceProxy = (service: ServiceConfig): RequestHandler => {
  const breaker = getOrCreateBreaker({
    name: service.name,
    failureThreshold: env.CB_FAILURE_THRESHOLD,
    resetTimeoutMs: env.CB_RESET_TIMEOUT_MS,
    halfOpenMaxAttempts: env.CB_HALF_OPEN_MAX,
  });

  const proxy = createProxyMiddleware({
    target: service.target,
    changeOrigin: true,
    timeout: service.timeout,
    proxyTimeout: service.timeout,

    // Strip the service prefix: /iam/auth/login → /auth/login
    pathRewrite: {
      [`^${service.pathPrefix}`]: "",
    },

    on: {
      proxyReq: (proxyReq, req) => {
        // Propagate request ID for distributed tracing
        const requestId = req.headers["x-request-id"];
        if (requestId) {
          proxyReq.setHeader("X-Request-ID", requestId);
        }

        log.debug(
          {
            service: service.name,
            method: req.method,
            path: req.url,
            target: `${service.target}${proxyReq.path}`,
          },
          "Proxying request",
        );
      },

      proxyRes: (proxyRes) => {
        // 5xx responses indicate upstream problems
        if (proxyRes.statusCode && proxyRes.statusCode >= 500) {
          breaker.recordFailure();
          log.warn(
            { service: service.name, status: proxyRes.statusCode },
            "Upstream returned server error",
          );
        } else {
          breaker.recordSuccess();
        }
      },

      error: (err, _req, res) => {
        breaker.recordFailure();
        log.error({ err, service: service.name }, "Proxy connection error");

        const response = res as ServerResponse;
        if (!response.headersSent) {
          response.writeHead(502, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({
              error: "Bad Gateway",
              status: 502,
              details: {
                service: service.name,
                message: `Unable to reach ${service.name}`,
              },
            }),
          );
        }
      },
    },
  });

  /**
   * Middleware that checks the circuit breaker before proxying.
   * Returns 503 Service Unavailable when the circuit is open.
   */
  const handler: RequestHandler = (req, res, next) => {
    if (!breaker.isAvailable()) {
      log.warn(
        { service: service.name, path: req.originalUrl },
        "Circuit breaker is open — rejecting request",
      );
      return next(
        new ServiceUnavailableError(
          `${service.name} is temporarily unavailable`,
          { service: service.name },
        ),
      );
    }
    proxy(req, res, next);
  };

  log.info(
    {
      service: service.name,
      prefix: service.pathPrefix,
      target: service.target,
    },
    "Service proxy registered",
  );

  return handler;
};

export { createServiceProxy };
