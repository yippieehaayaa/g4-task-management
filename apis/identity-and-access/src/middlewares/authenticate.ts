import { findIdentityById } from "@g4/db-iam";
import { UnauthorizedError } from "@g4/error-handler";
import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or malformed authorization header");
  }

  try {
    const payload = await verifyAccessToken(header.replace("Bearer ", ""));
    const identity = await findIdentityById(payload.sub);

    if (!identity || !identity.active || identity.deletedAt) {
      throw new UnauthorizedError("Identity is inactive or deleted");
    }

    req.identity = { ...identity, permissions: payload.permissions };
    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export { authenticate };
