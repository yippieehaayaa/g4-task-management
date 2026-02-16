import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLogout } from "@/api";

export const Route = createFileRoute("/logout")({
	component: LogoutPage,
});

function LogoutPage() {
	const navigate = useNavigate();
	const { mutate: logout, isPending, isSuccess, isError } = useLogout();

	useEffect(() => {
		logout();
	}, [logout]);

	// Redirect once logout has finished (success or error); tokens are cleared in onSettled either way
	useEffect(() => {
		if (!isPending && (isSuccess || isError)) {
			navigate({ to: "/login", search: { redirectUrl: undefined }, replace: true });
		}
	}, [isPending, isSuccess, isError, navigate]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<p className="text-muted-foreground">Signing out…</p>
		</div>
	);
}
