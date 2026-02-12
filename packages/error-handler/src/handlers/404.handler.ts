import type { NextFunction, Request, Response } from "express";

const notFoundHandler = (_req: Request, res: Response, _next: NextFunction) => {
  return res.sendStatus(404);
};

export { notFoundHandler };
