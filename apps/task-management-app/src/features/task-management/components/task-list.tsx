import { CircleAlert, ListTodoIcon, PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import {
	closeForm,
	openCreateForm,
	openEditForm,
	setFilters,
	setFormOpen,
} from "@/store/slices/task-ui-slice";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	listQuery,
	useCreateTask,
	useDeleteTask,
	useUpdateTask,
} from "@/api/task-management";
import type { CreateTaskFormValues, EditTaskFormValues } from "../schemas";
import type { Task } from "../types";
import { TaskFilters as TaskFiltersComponent } from "./task-filters";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskItem } from "./task-item";

function TaskList() {
	const dispatch = useAppDispatch();
	const { filters, formOpen, editingTaskId } = useAppSelector(
		(state) => state.taskUi,
	);
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
	const editingTask =
		editingTaskId != null
			? tasks.find((t: Task) => t.id === editingTaskId) ?? null
			: null;

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
				onSuccess: () => dispatch(closeForm()),
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
				onSuccess: () => dispatch(closeForm()),
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
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
				<Button
					onClick={() => dispatch(openCreateForm())}
					className="w-full shrink-0 sm:w-auto"
				>
					<PlusIcon className="size-4" aria-hidden />
					Add task
				</Button>
			</div>

			<Card className="border bg-card shadow-sm rounded-xl">
				<CardContent className="p-4 sm:p-5">
					<p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider sm:mb-4">
						Filters
					</p>
					<TaskFiltersComponent
						value={filters}
						onChange={(next) => dispatch(setFilters(next))}
					/>
				</CardContent>
			</Card>

			{isError ? (
				<Alert variant="destructive" className="rounded-xl">
					<CircleAlert className="size-4" />
					<AlertTitle>Failed to load tasks</AlertTitle>
					<AlertDescription>
						{error instanceof Error ? error.message : "Something went wrong. Try again later."}
					</AlertDescription>
				</Alert>
			) : isPending ? (
				<ul className="grid list-none gap-4 p-0 sm:grid-cols-1 lg:gap-5" aria-busy="true" aria-label="Loading tasks">
					{[1, 2, 3].map((i) => (
						<li key={i}>
							<Card className="overflow-hidden border rounded-xl shadow-sm">
								<CardContent className="flex flex-row items-start gap-4 p-5 sm:p-6">
									<Skeleton className="size-5 shrink-0 rounded-md" />
									<div className="min-w-0 flex-1 space-y-2">
										<Skeleton className="h-5 w-[75%] max-w-[12rem]" />
										<Skeleton className="h-4 w-full max-w-[16rem]" />
										<div className="flex gap-2 pt-1">
											<Skeleton className="h-5 w-16 rounded-full" />
											<Skeleton className="h-5 w-14 rounded-full" />
										</div>
									</div>
								</CardContent>
							</Card>
						</li>
					))}
				</ul>
			) : tasks.length === 0 ? (
				<Card className="overflow-hidden border border-dashed rounded-xl shadow-sm">
					<CardContent className="flex flex-col items-center justify-center py-14 text-center sm:py-20">
						<div className="bg-muted/50 mb-5 flex size-16 items-center justify-center rounded-full">
							<ListTodoIcon className="text-muted-foreground size-8" aria-hidden />
						</div>
						<h2 className="text-muted-foreground mb-1.5 text-base font-medium">
							No tasks yet
						</h2>
						<p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed">
							Create your first task to get started, or adjust your filters to see existing tasks.
						</p>
						<Button variant="outline" size="lg" onClick={() => dispatch(openCreateForm())}>
							<PlusIcon className="size-4" aria-hidden />
							Add task
						</Button>
					</CardContent>
				</Card>
			) : (
				<section className="space-y-4" aria-label="Task list">
					<p className="text-muted-foreground text-sm">
						{tasks.length} {tasks.length === 1 ? "task" : "tasks"}
					</p>
					<ul className="grid list-none gap-4 p-0 sm:grid-cols-1 lg:gap-5">
					{tasks.map((task: Task) => (
						<li key={task.id}>
							<TaskItem
								task={task}
								onToggleComplete={handleToggleComplete}
								onEdit={(t) => dispatch(openEditForm(t.id))}
								onDelete={(t) => deleteTask.mutate(t.id)}
							/>
						</li>
					))}
					</ul>
				</section>
			)}

			<TaskFormDialog
				open={formOpen}
				onOpenChange={(open) =>
					dispatch(open ? setFormOpen(true) : closeForm())
				}
				mode={editingTask ? "edit" : "create"}
				task={editingTask}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}

export { TaskList };
