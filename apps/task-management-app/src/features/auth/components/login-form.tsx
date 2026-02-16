import { Link } from "@tanstack/react-router";
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
import { type LoginFormValues, loginSchema } from "../schemas";
import { FormField } from "./form-field";

type LoginFormProps = {
	onSubmit?: (values: LoginFormValues) => void;
	isSubmitting?: boolean;
};

const defaultValues: LoginFormValues = {
	username: "",
	password: "",
};

function LoginForm({ onSubmit, isSubmitting = false }: LoginFormProps) {
	const [values, setValues] = useState<LoginFormValues>(defaultValues);
	const [errors, setErrors] = useState<
		Partial<Record<keyof LoginFormValues, string>>
	>({});

	function handleChange(field: keyof LoginFormValues) {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			setValues((prev) => ({ ...prev, [field]: e.target.value }));
			if (errors[field]) {
				setErrors((prev) => ({ ...prev, [field]: undefined }));
			}
		};
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const result = loginSchema.safeParse(values);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
			for (const issue of result.error.issues) {
				const path = issue.path[0] as keyof LoginFormValues;
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
		<Card className="mx-auto w-full max-w-md">
			<CardHeader className="space-y-1">
				<CardTitle>Log in</CardTitle>
				<CardDescription>
					Enter your credentials to access your account.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit} noValidate>
				<CardContent className="space-y-4">
					<FormField
						id="login-username"
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
						id="login-password"
						label="Password"
						type="password"
						placeholder="••••••••"
						autoComplete="current-password"
						value={values.password}
						onChange={handleChange("password")}
						error={errors.password}
						required
					/>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Signing in…" : "Sign in"}
					</Button>
					<p className="text-muted-foreground text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link
							to="/register"
							className="text-primary underline-offset-4 hover:underline"
						>
							Register
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}

export { LoginForm };
