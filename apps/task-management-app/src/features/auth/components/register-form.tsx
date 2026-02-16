import { Link } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
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
import { type RegisterFormValues, registerSchema } from "../schemas";
import { FormField } from "./form-field";

type RegisterFormProps = {
	onSubmit?: (values: RegisterFormValues) => void;
	isSubmitting?: boolean;
};

const defaultValues: RegisterFormValues = {
	username: "",
	email: "",
	password: "",
	confirmPassword: "",
};

function RegisterForm({ onSubmit, isSubmitting = false }: RegisterFormProps) {
	const [values, setValues] = useState<RegisterFormValues>(defaultValues);
	const [errors, setErrors] = useState<
		Partial<Record<keyof RegisterFormValues, string>>
	>({});

	function handleChange(field: keyof RegisterFormValues) {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			setValues((prev) => ({ ...prev, [field]: e.target.value }));
			if (errors[field]) {
				setErrors((prev) => ({ ...prev, [field]: undefined }));
			}
		};
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const toValidate = {
			...values,
			email: values.email?.trim() || undefined,
		};
		const result = registerSchema.safeParse(toValidate);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof RegisterFormValues, string>> = {};
			for (const issue of result.error.issues) {
				const path = issue.path[0] as keyof RegisterFormValues;
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
						<UserPlus className="text-muted-foreground size-5" />
					</div>
					<div className="min-w-0 space-y-1">
						<CardTitle className="text-xl">Create an account</CardTitle>
						<CardDescription>Enter your details to register.</CardDescription>
					</div>
				</div>
			</CardHeader>
			<form onSubmit={handleSubmit} noValidate>
				<CardContent className="space-y-5 px-0 pt-0 pb-0 sm:space-y-6">
					<FormField
						id="register-username"
						label="Username"
						type="text"
						placeholder="Username"
						autoComplete="username"
						value={values.username}
						onChange={handleChange("username")}
						error={errors.username}
						required
					/>
					<FormField
						id="register-email"
						label="Email (optional)"
						type="email"
						placeholder="name@example.com"
						autoComplete="email"
						value={values.email ?? ""}
						onChange={handleChange("email")}
						error={errors.email}
					/>
					<FormField
						id="register-password"
						label="Password"
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						value={values.password}
						onChange={handleChange("password")}
						error={errors.password}
						required
					/>
					<FormField
						id="register-confirm-password"
						label="Confirm password"
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						value={values.confirmPassword}
						onChange={handleChange("confirmPassword")}
						error={errors.confirmPassword}
						required
					/>
				</CardContent>
				<CardFooter className="flex flex-col gap-5 px-0 pt-6 pb-0 sm:gap-6 sm:pt-8">
					<Button type="submit" className="w-full min-h-10" disabled={isSubmitting}>
						{isSubmitting ? "Creating account…" : "Register"}
					</Button>
					<p className="text-muted-foreground text-center text-sm">
						Already have an account?{" "}
						<Link
							to="/login"
							search={{ redirectUrl: undefined }}
							className="text-primary underline-offset-4 hover:underline"
						>
							Log in
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}

export { RegisterForm };
