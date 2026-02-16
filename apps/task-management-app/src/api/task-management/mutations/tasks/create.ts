import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, CreateTaskInput, Task } from "../../../types";
import { taskKeys } from "../../queries/tasks";

export function useCreateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateTaskInput) =>
			api.post<ApiResponse<Task>>("/tm/tasks", input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
		},
	});
}
