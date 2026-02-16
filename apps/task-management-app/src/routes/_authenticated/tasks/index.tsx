import { createFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/features/task-management";

export const Route = createFileRoute("/_authenticated/tasks/")({
	component: TasksPage,
});

function TasksPage() {
	return <TaskList />;
}
