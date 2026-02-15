import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-foreground">
					Task Management App
				</h1>
				<p className="mt-4 text-lg text-muted-foreground">
					Welcome! Start building your app.
				</p>
			</div>
		</div>
	);
}
