import { Link } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChangePasswordFormValues,
	changePasswordSchema,
} from "../schemas";
import { FormField } from "./form-field";

type ChangePasswordFormProps = {
	onSubmit?: (values: ChangePasswordFormValues) => void;
	isSubmitting?: boolean;
};

const defaultValues: ChangePasswordFormValues = {
	currentPassword: "",
	newPassword: "",
	confirmNewPassword: "",
};

function ChangePasswordForm({
	onSubmit,
	isSubmitting = false,
}: ChangePasswordFormProps) {
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
		<Card className="mx-auto w-full max-w-md border shadow-sm px-5 pt-6 pb-2 sm:px-6 sm:pt-8 sm:pb-4">
			<CardHeader className="space-y-1.5 pb-5 px-0 pt-0 sm:pb-6">
				<div className="flex items-center gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
						<KeyRound className="text-muted-foreground size-5" />
					</div>
					<div className="min-w-0 space-y-1">
						<CardTitle className="text-xl">Change password</CardTitle>
						<CardDescription>
							Enter your current password and choose a new one.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<form onSubmit={handleSubmit} noValidate>
				<CardContent className="space-y-5 px-0 pt-0 pb-0 sm:space-y-6">
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
				<CardFooter className="flex flex-col gap-5 px-0 pt-6 pb-0 sm:gap-6 sm:pt-8">
					<Button type="submit" className="w-full min-h-10" disabled={isSubmitting}>
						{isSubmitting ? "Updating…" : "Update password"}
					</Button>
					<p className="text-muted-foreground text-center text-sm">
						<Link
							to="/login"
							search={{ redirectUrl: undefined }}
							className="text-primary underline-offset-4 hover:underline"
						>
							Back to log in
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}

export { ChangePasswordForm };
