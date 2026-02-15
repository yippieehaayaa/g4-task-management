import { UnauthorizedError } from "@g4/error-handler";
import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      next(new UnauthorizedError("Missing or malformed authorization header"));
      return;
    }

    const payload = await verifyAccessToken(header.replace("Bearer ", ""));

    req.identity = {
      sub: payload.sub,
      username: payload.username,
      kind: payload.kind,
      status: payload.status,
      permissions: payload.permissions,
    };

    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) return next(err);
    next(new UnauthorizedError("Invalid or expired token"));
  }
};

export { authenticate };
