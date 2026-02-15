import type { ErrorRequestHandler } from "express";
import { mapDbIamError } from "../utils/mapError";

export const dbIamErrorMapper: ErrorRequestHandler = (err, _req, res, next) => {
  const mapped = mapDbIamError(err);
  if (mapped) return res.status(mapped.status).json(mapped);
  next(err);
};
