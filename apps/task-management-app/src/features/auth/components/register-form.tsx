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
import { registerSchema, type RegisterFormValues } from "../schemas";
import { useState } from "react";

type RegisterFormProps = {
	onSubmit?: (values: RegisterFormValues) => void;
	isSubmitting?: boolean;
};

const defaultValues: RegisterFormValues = {
	email: "",
	password: "",
	confirmPassword: "",
};

function RegisterForm({ onSubmit, isSubmitting = false }: RegisterFormProps) {
	const [values, setValues] = useState<RegisterFormValues>(defaultValues);
	const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});

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
		const result = registerSchema.safeParse(values);
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
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1">
				<CardTitle>Create an account</CardTitle>
				<CardDescription>Enter your details to register.</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit} noValidate>
				<CardContent className="space-y-4">
					<FormField
						id="register-email"
						label="Email"
						type="email"
						placeholder="name@example.com"
						autoComplete="email"
						value={values.email}
						onChange={handleChange("email")}
						error={errors.email}
						required
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
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Creating account…" : "Register"}
					</Button>
					<p className="text-muted-foreground text-center text-sm">
						Already have an account?{" "}
						<Link to="/login" className="text-primary underline-offset-4 hover:underline">
							Log in
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}

export { RegisterForm };
