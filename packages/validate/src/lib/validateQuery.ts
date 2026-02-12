import { BadRequestError } from "@g4/error-handler";
import type { RequestHandler } from "express";
import type { z } from "zod";

const validateQuery = (schema: z.ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      throw new BadRequestError("Invalid query", result.error.issues);
    }

    req.query = result.data as typeof req.query;
    next();
  };
};

export default validateQuery;
