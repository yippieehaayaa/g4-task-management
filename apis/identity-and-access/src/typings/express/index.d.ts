import "express";

import type { AuthIdentity } from "@g4/db-iam";

declare global {
  namespace Express {
    interface Identity extends AuthIdentity {
      permissions: string[];
    }

    interface Request {
      id: string;
      identity: Identity;
      rateLimit?: {
        limit: number;
        used: number;
        remaining: number;
        resetTime?: Date;
        key: string;
      };
    }
  }
}
