import { z } from "zod";

const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export { taskStatusSchema, taskPrioritySchema };
