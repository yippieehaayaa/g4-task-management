import { BadRequestError } from "@g4/error-handler";
import type { RequestHandler } from "express";
import type { z } from "zod";

const validateParams = (schema: z.ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      throw new BadRequestError("Invalid params", result.error.issues);
    }

    req.params = result.data as typeof req.params;
    next();
  };
};

export default validateParams;
