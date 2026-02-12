import { BadRequestError } from "@g4/error-handler";
import type { RequestHandler } from "express";
import type { z } from "zod";

const validateBody = (schema: z.ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new BadRequestError("Invalid body", result.error.issues);
    }

    req.body = result.data;
    next();
  };
};

export default validateBody;
