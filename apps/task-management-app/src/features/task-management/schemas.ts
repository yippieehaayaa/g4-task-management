import { TASK_PRIORITIES, TASK_STATUSES } from "./types";
import { z } from "zod";

const taskStatusSchema = z.enum(TASK_STATUSES);
const taskPrioritySchema = z.enum(TASK_PRIORITIES);

/** Form values for creating a new task. */
export const createTaskSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title is too long"),
	description: z.string().max(2000).default(""),
	status: taskStatusSchema.default("todo"),
	priority: taskPrioritySchema.default("medium"),
	dueDate: z.string().optional(),
});

/** Form values for editing an existing task. */
export const editTaskSchema = createTaskSchema;

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
export type EditTaskFormValues = z.infer<typeof editTaskSchema>;
