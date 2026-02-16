import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Task } from "../../../types";
import { taskKeys } from "./keys";

export const detailQuery = (id: string) =>
	queryOptions({
		queryKey: taskKeys.detail(id),
		queryFn: () => api.get<ApiResponse<Task>>(`/tm/tasks/${id}`),
	});
