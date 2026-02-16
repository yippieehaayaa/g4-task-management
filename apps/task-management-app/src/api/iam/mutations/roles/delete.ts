import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { roleKeys } from "../../queries/roles";

export function useDeleteRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => api.delete(`/iam/roles/${id}`),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
			queryClient.removeQueries({ queryKey: roleKeys.detail(id) });
		},
	});
}
