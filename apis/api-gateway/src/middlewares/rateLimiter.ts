import { TooManyRequestsError } from "@g4/error-handler";
import rateLimit from "express-rate-limit";
import { env } from "../config";

type RateLimitInfo = {
  resetTime?: Date;
  limit?: number;
  used?: number;
  remaining?: number;
};

const getRetryAfterSeconds = (
  info: RateLimitInfo | undefined,
  windowMs: number,
): number => {
  if (info?.resetTime instanceof Date) {
    const delta = Math.ceil((info.resetTime.getTime() - Date.now()) / 1000);
    return Math.max(0, delta);
  }
  return Math.ceil(windowMs / 1000);
};

const createRateLimiter = (windowMs: number, limit: number) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      const info = req.rateLimit as RateLimitInfo | undefined;
      const retryAfterSeconds = getRetryAfterSeconds(
        info,
        options?.windowMs ?? windowMs,
      );
      res.setHeader("Retry-After", retryAfterSeconds);
      next(
        new TooManyRequestsError("Too many requests", {
          retryAfterSeconds,
        }),
      );
    },
  });

/**
 * Gateway-level rate limiter.
 * Higher default limit (200/min) than downstream services (100/min)
 * since the gateway aggregates traffic across all services.
 */
const apiRateLimiter = createRateLimiter(
  env.RATE_LIMIT_WINDOW_MS,
  env.RATE_LIMIT_MAX,
);

export { apiRateLimiter };
