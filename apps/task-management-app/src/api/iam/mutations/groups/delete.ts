import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { groupKeys } from "../../queries/groups";

export function useDeleteGroup() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => api.delete(`/iam/groups/${id}`),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
			queryClient.removeQueries({ queryKey: groupKeys.detail(id) });
		},
	});
}
