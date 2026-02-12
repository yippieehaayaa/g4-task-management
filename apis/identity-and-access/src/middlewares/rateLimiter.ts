import { TooManyRequestsError } from "@g4/error-handler";
import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError());
  },
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError());
  },
});

export { authRateLimiter, apiRateLimiter };
