import { taskPrioritySchema, taskStatusSchema } from "@g4/schemas/task-management";
import { z } from "zod";

export const createTaskSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title is too long"),
	description: z.string().max(2000).default(""),
	status: taskStatusSchema.default("TODO"),
	priority: taskPrioritySchema.default("MEDIUM"),
	dueDate: z.string().optional(),
});

export const editTaskSchema = createTaskSchema;

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
export type EditTaskFormValues = z.infer<typeof editTaskSchema>;
