import { TooManyRequestsError } from "@g4/error-handler";
import rateLimit from "express-rate-limit";

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

const authRateLimiter = createRateLimiter(60 * 1000, 5);
const apiRateLimiter = createRateLimiter(60 * 1000, 100);

export { authRateLimiter, apiRateLimiter };
