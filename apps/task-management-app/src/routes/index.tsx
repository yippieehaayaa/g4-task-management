import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-foreground">
					Task Management App
				</h1>
				<p className="mt-4 text-lg text-muted-foreground">
					Welcome! Start building your app.
				</p>
			</div>
			<nav className="flex flex-wrap items-center justify-center gap-4">
				<Link
					to="/login"
					className="text-primary underline-offset-4 hover:underline"
				>
					Log in
				</Link>
				<Link
					to="/register"
					className="text-primary underline-offset-4 hover:underline"
				>
					Register
				</Link>
				<Link
					to="/change-password"
					className="text-primary underline-offset-4 hover:underline"
				>
					Change password
				</Link>
			</nav>
		</div>
	);
}
