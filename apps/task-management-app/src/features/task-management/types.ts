export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
	id: string;
	title: string;
	description: string | null;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate: string | null;
	identityId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface TaskFilters {
	search: string;
	status: TaskStatus | "all";
	priority: TaskPriority | "all";
}
