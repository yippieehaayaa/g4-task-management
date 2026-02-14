import { findIdentityById } from "@g4/db-iam";
import { UnauthorizedError } from "@g4/error-handler";
import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new UnauthorizedError("Missing or malformed authorization header"));
    return;
  }

  verifyAccessToken(header.replace("Bearer ", ""))
    .then((payload) =>
      findIdentityById(payload.sub).then((identity) => ({ payload, identity })),
    )
    .then(({ payload, identity }) => {
      if (!identity || !identity.active || identity.deletedAt) {
        return next(new UnauthorizedError("Identity is inactive or deleted"));
      }
      req.identity = { ...identity, permissions: payload.permissions };
      next();
    })
    .catch((err) => {
      if (err instanceof UnauthorizedError) return next(err);
      next(new UnauthorizedError("Invalid or expired token"));
    });
};

export { authenticate };
