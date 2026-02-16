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
		<div className="space-y-6">
			<SessionManagement
				sessions={sessions}
				currentSessionId={currentSessionId}
				onRevokeSession={handleRevokeSession}
				isRevoking={isRevoking}
			/>
		</div>
	);
}
