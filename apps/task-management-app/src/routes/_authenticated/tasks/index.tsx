import { createFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/features/task-management";

export const Route = createFileRoute("/_authenticated/tasks/")({
	component: TasksPage,
});

function TasksPage() {
	return (
		<div>
			<div className="mb-6">
				<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
					Task Management
				</h1>
				<p className="text-muted-foreground text-sm">
					Manage your tasks.
				</p>
			</div>
			<TaskList />
		</div>
	);
}
