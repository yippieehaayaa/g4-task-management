import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { taskKeys } from "../../queries/tasks";

export function useDeleteTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => api.delete(`/tm/tasks/${id}`),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
			queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
		},
	});
}
