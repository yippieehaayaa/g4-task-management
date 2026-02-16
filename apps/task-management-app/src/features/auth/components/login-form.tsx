import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
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
		<Card className="mx-auto w-full max-w-md border shadow-sm px-5 pt-6 pb-2 sm:px-6 sm:pt-8 sm:pb-4">
			<CardHeader className="space-y-1.5 pb-5 px-0 pt-0 sm:pb-6">
				<div className="flex items-center gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
						<LogIn className="text-muted-foreground size-5" />
					</div>
					<div className="min-w-0 space-y-1">
						<CardTitle className="text-xl">Log in</CardTitle>
						<CardDescription>
							Enter your credentials to access your account.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<form onSubmit={handleSubmit} noValidate>
				<CardContent className="space-y-5 px-0 pt-0 pb-0 sm:space-y-6">
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
				<CardFooter className="flex flex-col gap-5 px-0 pt-6 pb-0 sm:gap-6 sm:pt-8">
					<Button type="submit" className="w-full min-h-10" disabled={isSubmitting}>
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
