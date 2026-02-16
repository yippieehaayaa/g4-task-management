import { useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { ApiError, useChangePassword, useLogout } from "@/api";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/features/auth/components/form-field";
import {
	type ChangePasswordFormValues,
	changePasswordSchema,
} from "@/features/auth/schemas";

const defaultValues: ChangePasswordFormValues = {
	currentPassword: "",
	newPassword: "",
	confirmNewPassword: "",
};

export function ChangePasswordCard() {
	const navigate = useNavigate();
	const [values, setValues] = useState<ChangePasswordFormValues>(defaultValues);
	const [errors, setErrors] = useState<
		Partial<Record<keyof ChangePasswordFormValues, string>>
	>({});
	const [success, setSuccess] = useState(false);

	const { mutate: changePassword, isPending } = useChangePassword();
	const { mutate: logout } = useLogout();

	function handleChange(field: keyof ChangePasswordFormValues) {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			setValues((prev) => ({ ...prev, [field]: e.target.value }));
			if (errors[field]) {
				setErrors((prev) => ({ ...prev, [field]: undefined }));
			}
			setSuccess(false);
		};
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSuccess(false);
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
		changePassword(
			{
				currentPassword: result.data.currentPassword,
				newPassword: result.data.newPassword,
			},
			{
				onSuccess: () => {
					setValues(defaultValues);
					setSuccess(true);
					logout(undefined, {
						onSettled: () => {
							navigate({
								to: "/login",
								search: { redirectUrl: undefined },
								replace: true,
							});
						},
					});
				},
				onError: (err) => {
					if (err instanceof ApiError && err.status === 401) {
						setErrors({
							currentPassword: "Current password is wrong.",
						});
					} else {
						setErrors({
							currentPassword:
								(err as { message?: string })?.message ??
								"Failed to update password.",
						});
					}
				},
			},
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
						<KeyRound className="text-muted-foreground size-5" />
					</div>
					<div className="min-w-0 space-y-1">
						<CardTitle>Change password</CardTitle>
						<CardDescription>
							Enter your current password and choose a new one.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4" noValidate>
					<FormField
						id="settings-change-password-current"
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
						id="settings-change-password-new"
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
						id="settings-change-password-confirm"
						label="Confirm new password"
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						value={values.confirmNewPassword}
						onChange={handleChange("confirmNewPassword")}
						error={errors.confirmNewPassword}
						required
					/>
					{success && (
						<p className="text-primary text-sm font-medium">
							Password updated. Signing out…
						</p>
					)}
					<Button type="submit" disabled={isPending}>
						{isPending ? "Updating…" : "Update password"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
