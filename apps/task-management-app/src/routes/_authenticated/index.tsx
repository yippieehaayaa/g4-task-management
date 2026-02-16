import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<div>
			<div className="mb-8">
				<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
					Dashboard
				</h1>
				<p className="text-muted-foreground text-sm">
					Welcome back. Choose where to go next.
				</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Link
					to="/tasks"
					className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
				>
					<h2 className="font-medium">Tasks</h2>
					<p className="text-muted-foreground text-sm">Manage your tasks.</p>
				</Link>
				<Link
					to="/sessions"
					className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
				>
					<h2 className="font-medium">Sessions</h2>
					<p className="text-muted-foreground text-sm">
						Manage active sessions and devices.
					</p>
				</Link>
				<Link
					to="/settings"
					className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
				>
					<h2 className="font-medium">Settings</h2>
					<p className="text-muted-foreground text-sm">
						Account and preferences.
					</p>
				</Link>
			</div>
		</div>
	);
}
