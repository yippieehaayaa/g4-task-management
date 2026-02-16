/** Task status – for filtering and display. */
export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Task priority – for filtering and display. */
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/** Single task (local shape; not tied to API yet). */
export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate: string | null;
	createdAt: string;
	updatedAt: string;
}

/** Filter state for the task list. */
export interface TaskFilters {
	search: string;
	status: TaskStatus | "all";
	priority: TaskPriority | "all";
}
