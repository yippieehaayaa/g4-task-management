import {
	changePasswordBodySchema as changePasswordBodySchemaBase,
	createIdentitySchema,
	loginSchema as loginSchemaBase,
} from "@g4/schemas/iam";
import { z } from "zod";

/** Login form/API schema from @g4/schemas (username + password). */
export const loginSchema = loginSchemaBase;
export type LoginFormValues = z.infer<typeof loginSchema>;

/** Register form: createIdentitySchema + confirmPassword for UI. */
export const registerSchema = createIdentitySchema
	.extend({
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type RegisterFormValues = z.infer<typeof registerSchema>;

/** Change password form: changePasswordBodySchema + confirmNewPassword for UI. */
export const changePasswordSchema = changePasswordBodySchemaBase
	.extend({
		confirmNewPassword: z.string().min(1, "Please confirm your new password"),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match",
		path: ["confirmNewPassword"],
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "New password must be different from current password",
		path: ["newPassword"],
	});
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
