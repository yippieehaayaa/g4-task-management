import { createFileRoute } from "@tanstack/react-router";
import { ChangePasswordForm } from "@/features/auth";

export const Route = createFileRoute("/change-password")({
	component: ChangePasswordPage,
});

function ChangePasswordPage() {
	function handleSubmit() {
		// API connection to be added later
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<ChangePasswordForm onSubmit={handleSubmit} />
		</div>
	);
}
