import { createLogger } from "@g4/logger";
import { Router } from "express";
import { getBreakers } from "../../proxy/circuitBreaker";
import { getServiceRegistry } from "../../proxy/registry";

const log = createLogger({ service: "api-gateway", module: "health" });
const router = Router();

/**
 * GET /health — Liveness probe.
 * Returns 200 if the gateway process is running.
 */
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * GET /readiness — Readiness probe.
 * Checks all downstream services and reports aggregated health.
 *
 * Returns 200 when all services are healthy, 503 when degraded.
 * Includes circuit breaker state for each service.
 */
router.get("/readiness", async (_req, res) => {
  const services = getServiceRegistry();
  const breakers = getBreakers();

  const checks = await Promise.allSettled(
    services.map(async (service) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5_000);

      try {
        const response = await fetch(`${service.target}/health`, {
          signal: controller.signal,
        });

        return {
          name: service.name,
          status: response.ok ? ("healthy" as const) : ("unhealthy" as const),
          circuitBreaker: breakers.get(service.name)?.currentState ?? "UNKNOWN",
        };
      } finally {
        clearTimeout(timeout);
      }
    }),
  );

  const results = checks.map((result, index) => {
    const service = services[index];
    if (!service) {
      return { name: "unknown", status: "unhealthy" as const };
    }

    if (result.status === "fulfilled") {
      return result.value;
    }

    log.warn(
      { service: service.name, reason: String(result.reason) },
      "Health check failed for downstream service",
    );

    return {
      name: service.name,
      status: "unhealthy" as const,
      circuitBreaker: breakers.get(service.name)?.currentState ?? "UNKNOWN",
    };
  });

  const allHealthy = results.every((r) => r.status === "healthy");

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ok" : "degraded",
    services: results,
  });
});

export default router;
