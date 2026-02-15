import { z } from "zod";

import { paginationQuerySchema } from "./common";
import { taskPrioritySchema, taskStatusSchema } from "./enums";

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().max(2000).optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: z.coerce.date().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(2000).nullish(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: z.coerce.date().nullish(),
});

const listTasksQuerySchema = paginationQuerySchema.extend({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
});

export { createTaskSchema, updateTaskSchema, listTasksQuerySchema };
