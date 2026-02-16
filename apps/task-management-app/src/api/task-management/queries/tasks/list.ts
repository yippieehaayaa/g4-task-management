import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ListTasksParams, PaginatedResponse, Task } from "../../../types";
import { taskKeys } from "./keys";

export const listQuery = (params?: ListTasksParams) =>
	queryOptions({
		queryKey: taskKeys.list(params),
		queryFn: () =>
			api.get<PaginatedResponse<Task>>(
				"/tm/tasks",
				params as Record<string, unknown>,
			),
	});
