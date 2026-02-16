import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRevokeSession, authQueries } from "@/api";
import { SessionManagement } from "@/features/auth";

export const Route = createFileRoute("/_authenticated/sessions/")({
	component: SessionsPage,
});

function SessionsPage() {
	const { data: sessionsRes, isLoading } = useQuery(authQueries.sessions());
	const { mutate: revokeSession, isPending: isRevoking } = useRevokeSession();

	const sessions = sessionsRes?.data ?? [];
	const currentSessionId = sessions[0]?.id;

	function handleRevokeSession(sessionId: string) {
		revokeSession(sessionId);
	}

	if (isLoading) return <div className="text-muted-foreground">Loading sessions…</div>;

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
					Sessions
				</h1>
				<p className="text-muted-foreground text-sm">
					Manage your active sessions and devices.
				</p>
			</div>
			<SessionManagement
				sessions={sessions}
				currentSessionId={currentSessionId}
				onRevokeSession={handleRevokeSession}
				isRevoking={isRevoking}
			/>
		</div>
	);
}
