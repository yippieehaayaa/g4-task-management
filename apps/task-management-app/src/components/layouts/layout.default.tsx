import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function NavLink({
	to,
	children,
	active,
}: {
	to: string;
	children: React.ReactNode;
	active: boolean;
}) {
	return (
		<Link
			to={to}
			className={cn(
				"text-sm font-medium transition-colors rounded-md px-3 py-2 min-h-[2.25rem] min-w-[2.25rem] inline-flex items-center justify-center touch-manipulation",
				active
					? "text-foreground bg-accent"
					: "text-muted-foreground hover:text-foreground hover:bg-accent/50",
			)}
		>
			{children}
		</Link>
	);
}

export function DefaultLayout({ children }: { children?: React.ReactNode }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
				<nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-1 px-5 py-3 sm:gap-2 sm:px-8 sm:py-3">
					<Link
						to="/"
						className="text-muted-foreground hover:text-foreground mr-2 text-sm font-medium transition-colors rounded-md px-2 py-2 min-h-[2.25rem] inline-flex items-center touch-manipulation sm:mr-0"
					>
						Task Management
					</Link>
					<div className="flex flex-1 items-center justify-end gap-1 sm:justify-end sm:gap-2">
						<NavLink to="/tasks" active={pathname === "/tasks"}>
							Tasks
						</NavLink>
						<NavLink to="/settings" active={pathname === "/settings"}>
							Settings
						</NavLink>
						<NavLink to="/sessions" active={pathname === "/sessions"}>
							Sessions
						</NavLink>
						<Link
							to="/logout"
							className="text-muted-foreground hover:text-foreground ml-2 border-l border-border pl-3 text-sm font-medium transition-colors rounded-md px-2 py-2 min-h-[2.25rem] inline-flex items-center touch-manipulation sm:ml-2"
						>
							Log out
						</Link>
					</div>
				</nav>
			</header>
			<main className="mx-auto w-full max-w-4xl flex-1 px-5 py-6 sm:px-8 sm:py-8">
				{children ?? <Outlet />}
			</main>
		</div>
	);
}
