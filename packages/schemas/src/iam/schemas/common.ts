import { z } from "zod";

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().max(100).optional(),
});

const objectIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID"),
});

export { paginationQuerySchema, objectIdParamSchema };
