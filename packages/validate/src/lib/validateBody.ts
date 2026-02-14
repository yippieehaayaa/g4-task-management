import { BadRequestError } from "@g4/error-handler";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type z } from "zod";

const validateBody = (schema: z.ZodType): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError("Invalid body", error.issues);
      }
      throw error;
    }
  };
};

export default validateBody;
