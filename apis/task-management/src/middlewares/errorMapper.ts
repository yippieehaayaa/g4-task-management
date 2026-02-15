import type { ErrorRequestHandler } from "express";
import { mapDbTaskError } from "../utils/mapError";

export const dbTaskErrorMapper: ErrorRequestHandler = (
  err,
  _req,
  res,
  next,
) => {
  const mapped = mapDbTaskError(err);
  if (mapped) return res.status(mapped.status).json(mapped);
  next(err);
};
