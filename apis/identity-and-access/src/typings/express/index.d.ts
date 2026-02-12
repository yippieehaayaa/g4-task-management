import "express";

declare global {
  namespace Express {
    interface Identity {
      id: string;
      username: string;
      email: string | null;
      active: boolean;
      kind: import("@g4/db-iam").IdentityKind;
      status: import("@g4/db-iam").IdentityStatus;
      deletedAt: Date | null;
      permissions: string[];
    }

    interface Request {
      id: string;
      identity: Identity;
    }
  }
}
