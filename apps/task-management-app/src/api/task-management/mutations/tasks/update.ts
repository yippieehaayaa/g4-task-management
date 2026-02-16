import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Task, UpdateTaskInput } from "../../../types";
import { taskKeys } from "../../queries/tasks";

export function useUpdateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, ...input }: UpdateTaskInput & { id: string }) =>
			api.patch<ApiResponse<Task>>(`/tm/tasks/${id}`, input),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: taskKeys.detail(variables.id),
			});
		},
	});
}
