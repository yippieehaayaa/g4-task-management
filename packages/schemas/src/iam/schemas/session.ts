import { z } from "zod";

const createSessionSchema = z.object({
  token: z.string().min(1),
  identityId: z.string().min(1),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  expiresInHours: z.number().int().positive().optional(),
});

export { createSessionSchema };
