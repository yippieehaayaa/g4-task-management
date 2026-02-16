import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { LoginForm } from "@/features/auth";

export const Route = createFileRoute("/login")({
	validateSearch: (search: Record<string, unknown>) => ({
		redirectUrl: (search.redirectUrl as string | undefined) ?? undefined,
	}),
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const { redirectUrl } = Route.useSearch();
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(values: {
		username: string;
		password: string;
	}) {
		setError(null);
		setIsPending(true);
		try {
			await login(values.username, values.password);
			navigate({
				to: redirectUrl || "/",
				search: redirectUrl ? undefined : {},
				replace: true,
			});
		} catch (err) {
			const message =
				err instanceof Error && err.message.includes("fetch user data")
					? "We couldn't load your account. Please try again."
					: "Invalid username or password. Please try again.";
			setError(message);
		} finally {
			setIsPending(false);
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-5 sm:p-6 md:p-8">
			{error && (
				<p className="text-destructive mb-5 text-center text-sm" role="alert">
					{error}
				</p>
			)}
			<div className="w-full max-w-md">
				<LoginForm onSubmit={handleSubmit} isSubmitting={isPending} />
			</div>
		</div>
	);
}
