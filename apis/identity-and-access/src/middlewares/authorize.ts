import { ForbiddenError } from "@g4/error-handler";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import permissions from "express-jwt-permissions";

const guard = permissions({
  requestProperty: "identity",
  permissionsProperty: "permissions",
});

const authorize = (...required: string[]): RequestHandler => {
  const check = guard.check(required);

  return (req: Request, res: Response, next: NextFunction) => {
    check(req, res, (err?: unknown) => {
      if (err) return next(new ForbiddenError("Insufficient permissions"));
      next();
    });
  };
};

export { authorize };
