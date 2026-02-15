import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

const requestId: RequestHandler = (req, res, next) => {
  const id = (req.headers["x-request-id"] as string) || randomUUID();
  req.id = id;
  res.setHeader("X-Request-ID", id);
  next();
};

export { requestId };
