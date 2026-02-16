import { createFileRoute, Link } from "@tanstack/react-router";
import { TaskList } from "@/features/task-management";

export const Route = createFileRoute("/tasks")({
	component: TasksPage,
});

function TasksPage() {
	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
							Task Management
						</h1>
						<p className="text-muted-foreground text-sm">
							Manage your tasks locally (no API yet).
						</p>
					</div>
					<Link
						to="/"
						className="text-primary text-sm underline-offset-4 hover:underline"
					>
						← Back to home
					</Link>
				</div>
			</header>
			<main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
				<TaskList />
			</main>
		</div>
	);
}
