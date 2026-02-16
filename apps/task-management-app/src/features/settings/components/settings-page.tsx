// import { Link } from "@tanstack/react-router";
// import { LogOut } from "lucide-react";
import { ChangePasswordCard } from "./change-password-card";

export function SettingsPage() {
	return (
		<div className="space-y-6">
			<ChangePasswordCard />
			<div className="flex items-center gap-2">
				{/* <Link
					to="/logout"
					className="text-primary inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"
				>
					<LogOut className="size-4" aria-hidden />
					Log out
				</Link> */}
			</div>
		</div>
	);
}
