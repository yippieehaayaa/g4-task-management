import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	function handleSubmit() {
		// API connection to be added later
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<LoginForm onSubmit={handleSubmit} />
		</div>
	);
}
