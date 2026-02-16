import { ListTodoIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	listQuery,
	useCreateTask,
	useDeleteTask,
	useUpdateTask,
} from "@/api/task-management";
import type { CreateTaskFormValues, EditTaskFormValues } from "../schemas";
import type { Task, TaskFilters } from "../types";
import { TaskFilters as TaskFiltersComponent } from "./task-filters";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskItem } from "./task-item";

const defaultFilters: TaskFilters = {
	search: "",
	status: "all",
	priority: "all",
};

function TaskList() {
	const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
	const [formOpen, setFormOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	const listParams = {
		search: filters.search.trim() || undefined,
		status: filters.status === "all" ? undefined : filters.status,
		priority: filters.priority === "all" ? undefined : filters.priority,
	};

	const { data, isPending, isError, error } = useQuery(listQuery(listParams));
	const createTask = useCreateTask();
	const updateTask = useUpdateTask();
	const deleteTask = useDeleteTask();

	const tasks = data?.data ?? [];

	function handleCreate(values: CreateTaskFormValues) {
		createTask.mutate(
			{
				title: values.title,
				description: values.description || undefined,
				status: values.status,
				priority: values.priority,
				dueDate: values.dueDate?.trim() || undefined,
			},
			{
				onSuccess: () => setFormOpen(false),
			},
		);
	}

	function handleEdit(values: EditTaskFormValues) {
		if (!editingTask) return;
		updateTask.mutate(
			{
				id: editingTask.id,
				title: values.title,
				description: values.description || null,
				status: values.status,
				priority: values.priority,
				dueDate: values.dueDate?.trim() || null,
			},
			{
				onSuccess: () => {
					setEditingTask(null);
					setFormOpen(false);
				},
			},
		);
	}

	function handleSubmit(values: CreateTaskFormValues | EditTaskFormValues) {
		if (editingTask) {
			handleEdit(values as EditTaskFormValues);
		} else {
			handleCreate(values as CreateTaskFormValues);
		}
	}

	function handleToggleComplete(task: Task) {
		updateTask.mutate({
			id: task.id,
			status: task.status === "DONE" ? "TODO" : "DONE",
		});
	}

	const isSubmitting =
		createTask.isPending || updateTask.isPending;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-2xl font-semibold tracking-tight">Tasks</h2>
				<Button
					onClick={() => {
						setEditingTask(null);
						setFormOpen(true);
					}}
					className="w-full sm:w-auto"
				>
					<PlusIcon className="size-4" />
					Add task
				</Button>
			</div>

			<TaskFiltersComponent value={filters} onChange={setFilters} />

			{isError ? (
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-4 text-sm text-destructive">
					{error instanceof Error ? error.message : "Failed to load tasks"}
				</div>
			) : isPending ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 px-4 py-16 text-center">
					<p className="text-muted-foreground text-sm">Loading tasks…</p>
				</div>
			) : tasks.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 px-4 py-16 text-center">
					<ListTodoIcon className="text-muted-foreground mb-4 size-12" />
					<p className="text-muted-foreground mb-2 text-sm font-medium">
						No tasks yet
					</p>
					<p className="text-muted-foreground mb-4 max-w-sm text-sm">
						Create a task to get started, or adjust your filters.
					</p>
					<Button variant="outline" onClick={() => setFormOpen(true)}>
						<PlusIcon className="size-4" />
						Add task
					</Button>
				</div>
			) : (
				<ul className="grid list-none gap-4 p-0 sm:grid-cols-1 lg:gap-5">
					{tasks.map((task: Task) => (
						<li key={task.id}>
							<TaskItem
								task={task}
								onToggleComplete={handleToggleComplete}
								onEdit={(t) => {
									setEditingTask(t);
									setFormOpen(true);
								}}
								onDelete={(t) => deleteTask.mutate(t.id)}
							/>
						</li>
					))}
				</ul>
			)}

			<TaskFormDialog
				open={formOpen}
				onOpenChange={(open) => {
					setFormOpen(open);
					if (!open) setEditingTask(null);
				}}
				mode={editingTask ? "edit" : "create"}
				task={editingTask}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}

export { TaskList };
