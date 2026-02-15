import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { AppError } from "./errors";

const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    if (
      err.status === 429 &&
      err.details &&
      typeof err.details === "object" &&
      "retryAfterSeconds" in err.details &&
      typeof (err.details as { retryAfterSeconds: number })
        .retryAfterSeconds === "number"
    ) {
      res.setHeader(
        "Retry-After",
        String(
          (err.details as { retryAfterSeconds: number }).retryAfterSeconds,
        ),
      );
    }
    return res.status(err.status).json(err);
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal server error", status: 500 });
};

export { errorHandler };
