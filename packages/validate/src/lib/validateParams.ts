import { BadRequestError } from "@g4/error-handler";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type z } from "zod";

const validateParams = (schema: z.ZodType): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new BadRequestError("Invalid params", error.issues));
      }
      next(error);
    }
  };
};

export default validateParams;
