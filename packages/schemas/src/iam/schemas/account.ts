import { z } from "zod";
import { paginationQuerySchema } from "./common";
import { identityKindSchema, identityStatusSchema } from "./enums";

const createIdentitySchema = z.object({
  username: z.string().min(1),
  email: z.email().optional(),
  password: z.string().min(8),
  kind: identityKindSchema.optional(),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const verifyIdentitySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

const passwordSchema = z
  .string()
  .min(8)
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one digit")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character");

const changePasswordSchema = z.object({
  identityId: z.string().min(1),
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
  ipAddress: z.string().optional(),
});

const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

const changeEmailSchema = z.object({
  identityId: z.string().min(1),
  newEmail: z.email(),
  ipAddress: z.string().optional(),
});

const changeEmailBodySchema = z.object({
  newEmail: z.email(),
});

const updateIdentitySchema = z.object({
  status: identityStatusSchema.optional(),
  kind: identityKindSchema.optional(),
  active: z.boolean().optional(),
});

const listIdentitiesQuerySchema = paginationQuerySchema.extend({
  status: identityStatusSchema.optional(),
  kind: identityKindSchema.optional(),
});

export {
  createIdentitySchema,
  loginSchema,
  verifyIdentitySchema,
  changePasswordSchema,
  changePasswordBodySchema,
  changeEmailSchema,
  changeEmailBodySchema,
  updateIdentitySchema,
  listIdentitiesQuerySchema,
};
