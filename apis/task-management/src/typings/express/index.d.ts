import "express";

declare global {
  namespace Express {
    interface Identity {
      sub: string;
      username: string;
      kind: string;
      status: string;
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
