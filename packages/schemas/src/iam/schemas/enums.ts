import { z } from "zod";

const identityStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "PENDING_VERIFICATION",
]);

const identityKindSchema = z.enum(["USER", "SERVICE", "ADMIN"]);

const otpPurposeSchema = z.enum([
  "REGISTRATION",
  "LOGIN",
  "PASSWORD_RESET",
  "EMAIL_VERIFICATION",
]);

const otpStatusSchema = z.enum(["PENDING", "VERIFIED", "EXPIRED"]);

const policyEffectSchema = z.enum(["ALLOW", "DENY"]);

export {
  identityStatusSchema,
  identityKindSchema,
  otpPurposeSchema,
  otpStatusSchema,
  policyEffectSchema,
};
