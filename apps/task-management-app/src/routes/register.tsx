import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useRegister } from "@/api";
import { RegisterForm } from "@/features/auth";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	const navigate = useNavigate();
	const { mutate: register, isPending, isSuccess } = useRegister();

	useEffect(() => {
		if (isSuccess) {
			navigate({ to: "/login", search: { redirectUrl: undefined }, replace: true });
		}
	}, [isSuccess, navigate]);

	function handleSubmit(values: {
		username: string;
		password: string;
		email?: string;
	}) {
		register({
			username: values.username,
			password: values.password,
			email: values.email?.trim() || undefined,
		});
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-5 sm:p-6 md:p-8">
			<div className="w-full max-w-md">
				<RegisterForm onSubmit={handleSubmit} isSubmitting={isPending} />
			</div>
		</div>
	);
}
