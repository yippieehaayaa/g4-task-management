import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/** Session shape for UI (matches API when wired). */
export type Session = {
	id: string;
	identityId: string;
	ipAddress?: string;
	userAgent?: string;
	expiresAt: string;
	revokedAt?: string;
	createdAt: string;
};

type SessionManagementProps = {
	/** List of sessions. When not provided, placeholder data is shown for UI preview. */
	sessions?: Session[];
	/** Current session id (e.g. from auth context). Revoke is disabled for this session. */
	currentSessionId?: string;
	/** Called when user confirms revoking a session. */
	onRevokeSession?: (sessionId: string) => void;
	/** Whether a revoke request is in progress. */
	isRevoking?: boolean;
};

function formatDate(value: string): string {
	try {
		const d = new Date(value);
		return d.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return value;
	}
}

function parseDeviceLabel(userAgent?: string): string {
	if (!userAgent) return "Unknown device";
	// Simple heuristic: mobile-like UA → Mobile, else Desktop
	if (
		/iPad|iPhone|Android|webOS|Mobile|IEMobile|Opera Mini/i.test(userAgent)
	) {
		return "Mobile device";
	}
	return "Desktop";
}

const MOCK_SESSIONS: Session[] = [
	{
		id: "session-current",
		identityId: "user-1",
		ipAddress: "192.168.1.1",
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		createdAt: new Date().toISOString(),
	},
	{
		id: "session-other-1",
		identityId: "user-1",
		ipAddress: "203.0.113.42",
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
		expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
	},
];

function SessionManagement({
	sessions = MOCK_SESSIONS,
	currentSessionId,
	onRevokeSession,
	isRevoking = false,
}: SessionManagementProps) {
	const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null);

	const handleRevokeClick = (sessionId: string) => {
		setRevokeTargetId(sessionId);
	};

	const handleRevokeConfirm = () => {
		if (revokeTargetId) {
			onRevokeSession?.(revokeTargetId);
			setRevokeTargetId(null);
		}
	};

	const handleRevokeCancel = () => {
		setRevokeTargetId(null);
	};

	const isCurrent = (session: Session) =>
		currentSessionId != null && session.id === currentSessionId;

	return (
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader className="space-y-1">
				<CardTitle>Sessions</CardTitle>
				<CardDescription>
					Manage your active sessions. Revoking a session will log that device
					out.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<ul className="space-y-3">
					{sessions.map((session) => {
						const current = isCurrent(session);
						const deviceLabel = parseDeviceLabel(session.userAgent);
						const Icon =
							deviceLabel === "Mobile device" ? Smartphone : Monitor;

						return (
							<li key={session.id}>
								<div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex min-w-0 flex-1 items-start gap-3">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
											<Icon className="text-muted-foreground size-5" />
										</div>
										<div className="min-w-0 space-y-1">
											<div className="flex flex-wrap items-center gap-2">
												<span className="font-medium">{deviceLabel}</span>
												{current && (
													<Badge variant="secondary" className="text-xs">
														This device
													</Badge>
												)}
											</div>
											{session.ipAddress && (
												<p className="text-muted-foreground text-sm">
													{session.ipAddress}
												</p>
											)}
											<p className="text-muted-foreground text-xs">
												Signed in {formatDate(session.createdAt)}
											</p>
										</div>
									</div>
									<div className="shrink-0">
										<Button
											variant="outline"
											size="sm"
											disabled={current || isRevoking}
											onClick={() => handleRevokeClick(session.id)}
											aria-label={
												current
													? "Cannot revoke current session"
													: `Revoke session on ${deviceLabel}`
											}
										>
											Revoke
										</Button>
									</div>
								</div>
								{session.revokedAt && (
									<>
										<Separator className="my-2" />
										<p className="text-muted-foreground text-xs">
											Revoked {formatDate(session.revokedAt)}
										</p>
									</>
								)}
							</li>
						);
					})}
				</ul>
			</CardContent>

			<AlertDialog
				open={revokeTargetId != null}
				onOpenChange={(open) => !open && handleRevokeCancel()}
			>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Revoke session</AlertDialogTitle>
						<AlertDialogDescription>
							This will log out that device. The session will need to sign in
							again to access your account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleRevokeConfirm}
							disabled={isRevoking}
							variant="destructive"
						>
							{isRevoking ? "Revoking…" : "Revoke session"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}

export { SessionManagement };
