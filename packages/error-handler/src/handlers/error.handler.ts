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
    return res.status(err.status).json(err);
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal server error", status: 500 });
};

export { errorHandler };
