import "express";

declare global {
  namespace Express {
    interface Request {
      id: string;
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
