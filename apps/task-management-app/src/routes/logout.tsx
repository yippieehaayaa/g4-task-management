import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLogout } from "@/api";

export const Route = createFileRoute("/logout")({
	component: LogoutPage,
});

function LogoutPage() {
	const navigate = useNavigate();
	const { mutate: logout, isPending, isSuccess } = useLogout();

	useEffect(() => {
		logout();
	}, [logout]);

	useEffect(() => {
		if (isSuccess && !isPending) {
			navigate({ to: "/login", search: { redirectUrl: undefined }, replace: true });
		}
	}, [isSuccess, isPending, navigate]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<p className="text-muted-foreground">Signing out…</p>
		</div>
	);
}
