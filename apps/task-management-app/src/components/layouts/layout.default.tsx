import { Link, Outlet, useRouterState } from "@tanstack/react-router";

export function DefaultLayout({ children }: { children?: React.ReactNode }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<header className="sticky top-0 z-10 border-b bg-card">
				<nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3 sm:px-6">
					<Link
						to="/"
						className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					>
						Task Management
					</Link>
					<div className="flex flex-1 items-center gap-4">
						<Link
							to="/tasks"
							className={`text-sm font-medium transition-colors ${
								pathname === "/tasks"
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Tasks
						</Link>
						<Link
							to="/settings"
							className={`text-sm font-medium transition-colors ${
								pathname === "/settings"
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Settings
						</Link>
						<Link
							to="/sessions"
							className={`text-sm font-medium transition-colors ${
								pathname === "/sessions"
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Sessions
						</Link>
					</div>
					<Link
						to="/logout"
						className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					>
						Log out
					</Link>
				</nav>
			</header>
			<main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
				{children ?? <Outlet />}
			</main>
		</div>
	);
}
