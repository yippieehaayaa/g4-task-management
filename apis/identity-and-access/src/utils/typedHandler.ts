import type { NextFunction, Request, Response } from "express";

type TypedLocals<TParams, TBody, TQuery> = {
  params: TParams;
  body: TBody;
  query: TQuery;
};

type TypedHandler<TParams = unknown, TBody = unknown, TQuery = unknown> = (
  req: Request,
  res: Response<unknown, TypedLocals<TParams, TBody, TQuery>>,
  next: NextFunction,
) => Promise<void> | void;

const typedHandler =
  <TParams = unknown, TBody = unknown, TQuery = unknown>(
    handler: TypedHandler<TParams, TBody, TQuery>,
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(
      req,
      res as Response<unknown, TypedLocals<TParams, TBody, TQuery>>,
      next,
    );

export { typedHandler, type TypedHandler };
