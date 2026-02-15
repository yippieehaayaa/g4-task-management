import { TaskNotFoundError } from "@g4/db-task-management";
import { type AppError, NotFoundError } from "@g4/error-handler";

export function mapDbTaskError(err: unknown): AppError | null {
  if (err instanceof TaskNotFoundError) return new NotFoundError(err.message);
  return null;
}
