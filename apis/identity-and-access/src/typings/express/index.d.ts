import "express";

import type { Prisma } from "@g4/db-iam";

type IdentityBody = Prisma.IdentityGetPayload<object>;

declare global {
  namespace Express {
    interface Identity extends IdentityBody {
      permissions: string[];
    }

    interface Request {
      identity: Identity;
    }
  }
}
