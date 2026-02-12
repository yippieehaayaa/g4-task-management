import type { NextFunction, Request, Response } from "express";

type TypedHandler<TParams = unknown, TBody = unknown, TQuery = unknown> = (
  req: Request<TParams, unknown, TBody, TQuery>,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

const typedHandler =
  <TParams = unknown, TBody = unknown, TQuery = unknown>(
    handler: TypedHandler<TParams, TBody, TQuery>,
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(
      req as unknown as Request<TParams, unknown, TBody, TQuery>,
      res,
      next,
    );

export { typedHandler, type TypedHandler };
