import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/auth";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate({ to: "/login", search: { redirectUrl: undefined }, replace: true });
		}
	}, [isAuthenticated, isLoading, navigate]);

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return <Outlet />;
}
