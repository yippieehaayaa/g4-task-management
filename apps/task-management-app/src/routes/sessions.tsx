import { createFileRoute, Link } from "@tanstack/react-router";
import { SessionManagement } from "@/features/auth";

export const Route = createFileRoute("/sessions")({
	component: SessionsPage,
});

function SessionsPage() {
	function handleRevokeSession(_sessionId: string) {
		// API connection to be added later
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<div className="flex w-full max-w-2xl flex-col items-center gap-6">
				<SessionManagement
					currentSessionId="session-current"
					onRevokeSession={handleRevokeSession}
				/>
				<p className="text-muted-foreground text-center text-sm">
					<Link
						to="/login"
						className="text-primary underline-offset-4 hover:underline"
					>
						Back to log in
					</Link>
				</p>
			</div>
		</div>
	);
}
