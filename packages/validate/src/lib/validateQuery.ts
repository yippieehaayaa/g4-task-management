import { BadRequestError } from "@g4/error-handler";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type z } from "zod";

const validateQuery = (schema: z.ZodType): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new BadRequestError("Invalid query", error.issues));
      }
      next(error);
    }
  };
};

export default validateQuery;
