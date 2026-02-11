import { z } from "zod";
import { identityKindSchema } from "./enums";

const createIdentitySchema = z.object({
  username: z.string().min(1),
  email: z.string().email().optional(),
  password: z.string().min(8),
  kind: identityKindSchema.optional(),
});

const verifyIdentitySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

const changePasswordSchema = z.object({
  identityId: z.string().min(1),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  ipAddress: z.string().optional(),
});

const changeEmailSchema = z.object({
  identityId: z.string().min(1),
  newEmail: z.string().email(),
  ipAddress: z.string().optional(),
});

export {
  createIdentitySchema,
  verifyIdentitySchema,
  changePasswordSchema,
  changeEmailSchema,
};
