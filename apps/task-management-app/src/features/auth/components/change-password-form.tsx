import { Link } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "./form-field";
import { changePasswordSchema, type ChangePasswordFormValues } from "../schemas";
import { useState } from "react";

type ChangePasswordFormProps = {
	onSubmit?: (values: ChangePasswordFormValues) => void;
	isSubmitting?: boolean;
};

const defaultValues: ChangePasswordFormValues = {
	currentPassword: "",
	newPassword: "",
	confirmNewPassword: "",
};

function ChangePasswordForm({ onSubmit, isSubmitting = false }: ChangePasswordFormProps) {
	const [values, setValues] = useState<ChangePasswordFormValues>(defaultValues);
	const [errors, setErrors] = useState<
		Partial<Record<keyof ChangePasswordFormValues, string>>
	>({});

	function handleChange(field: keyof ChangePasswordFormValues) {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			setValues((prev) => ({ ...prev, [field]: e.target.value }));
			if (errors[field]) {
				setErrors((prev) => ({ ...prev, [field]: undefined }));
			}
		};
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const result = changePasswordSchema.safeParse(values);
		if (!result.success) {
			const fieldErrors: Partial<
				Record<keyof ChangePasswordFormValues, string>
			> = {};
			for (const issue of result.error.issues) {
				const path = issue.path[0] as keyof ChangePasswordFormValues;
				if (path && !fieldErrors[path]) {
					fieldErrors[path] = issue.message;
				}
			}
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		onSubmit?.(result.data);
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1">
				<CardTitle>Change password</CardTitle>
				<CardDescription>
					Enter your current password and choose a new one.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit} noValidate>
				<CardContent className="space-y-4">
					<FormField
						id="change-password-current"
						label="Current password"
						type="password"
						placeholder="••••••••"
						autoComplete="current-password"
						value={values.currentPassword}
						onChange={handleChange("currentPassword")}
						error={errors.currentPassword}
						required
					/>
					<FormField
						id="change-password-new"
						label="New password"
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						value={values.newPassword}
						onChange={handleChange("newPassword")}
						error={errors.newPassword}
						required
					/>
					<FormField
						id="change-password-confirm"
						label="Confirm new password"
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						value={values.confirmNewPassword}
						onChange={handleChange("confirmNewPassword")}
						error={errors.confirmNewPassword}
						required
					/>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Updating…" : "Update password"}
					</Button>
					<p className="text-muted-foreground text-center text-sm">
						<Link to="/login" className="text-primary underline-offset-4 hover:underline">
							Back to log in
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}

export { ChangePasswordForm };
