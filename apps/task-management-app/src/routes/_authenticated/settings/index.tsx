import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/")({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<div>
			<div className="mb-6">
				<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
					Settings
				</h1>
				<p className="text-muted-foreground text-sm">
					Manage your account and preferences.
				</p>
			</div>
			<div className="space-y-4">
				<Link
					to="/change-password"
					className="text-primary block text-sm underline-offset-4 hover:underline"
				>
					Change password
				</Link>
			</div>
		</div>
	);
}
