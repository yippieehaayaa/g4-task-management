import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { ChangePasswordCard } from "./change-password-card";

export function SettingsPage() {
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
			<div className="space-y-6">
				<ChangePasswordCard />
				<div className="flex items-center gap-2">
					<Link
						to="/logout"
						className="text-primary inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"
					>
						<LogOut className="size-4" aria-hidden />
						Log out
					</Link>
				</div>
			</div>
		</div>
	);
}
