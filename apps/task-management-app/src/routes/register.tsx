import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	function handleSubmit() {
		// API connection to be added later
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<RegisterForm onSubmit={handleSubmit} />
		</div>
	);
}
