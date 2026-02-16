import { ListTodoIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import {
	selectFilteredTasks,
	selectTasksFilters,
} from "@/store/selectors/tasksSelectors";
import {
	addTask,
	deleteTask,
	setFilters,
	toggleTaskStatus,
	updateTask,
} from "@/store/slices/tasksSlice";
import type { CreateTaskFormValues, EditTaskFormValues } from "../schemas";
import type { Task } from "../types";
import { TaskFilters } from "./task-filters";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskItem } from "./task-item";

function TaskList() {
	const dispatch = useAppDispatch();
	const tasks = useAppSelector(selectFilteredTasks);
	const filters = useAppSelector(selectTasksFilters);

	const [formOpen, setFormOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function handleCreate(values: CreateTaskFormValues) {
		setIsSubmitting(true);
		dispatch(addTask(values));
		setIsSubmitting(false);
		setFormOpen(false);
	}

	function handleEdit(values: EditTaskFormValues) {
		if (!editingTask) return;
		setIsSubmitting(true);
		dispatch(updateTask({ id: editingTask.id, values }));
		setIsSubmitting(false);
		setEditingTask(null);
	}

	function handleSubmit(values: CreateTaskFormValues | EditTaskFormValues) {
		if (editingTask) {
			handleEdit(values as EditTaskFormValues);
		} else {
			handleCreate(values as CreateTaskFormValues);
		}
	}

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

			<TaskFilters value={filters} onChange={(f) => dispatch(setFilters(f))} />

			{tasks.length === 0 ? (
				<div className="bg-muted/50 flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
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
					{tasks.map((task) => (
						<li key={task.id}>
							<TaskItem
								task={task}
								onToggleComplete={(t) => dispatch(toggleTaskStatus(t))}
								onEdit={(t) => {
									setEditingTask(t);
									setFormOpen(true);
								}}
								onDelete={(t) => dispatch(deleteTask(t.id))}
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
