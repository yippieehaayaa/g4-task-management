import { z } from "zod";
import { otpPurposeSchema } from "./enums";

const createOtpSchema = z.object({
  code: z.string().min(1),
  purpose: otpPurposeSchema,
  identityId: z.string().min(1),
  expiresInMinutes: z.number().int().positive().optional(),
});

const verifyOtpSchema = z.object({
  identityId: z.string().min(1),
  code: z.string().min(1),
  purpose: otpPurposeSchema,
});

export { createOtpSchema, verifyOtpSchema };
