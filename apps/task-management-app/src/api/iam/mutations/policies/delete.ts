import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { policyKeys } from "../../queries/policies";

export function useDeletePolicy() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => api.delete(`/iam/policies/${id}`),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
			queryClient.removeQueries({ queryKey: policyKeys.detail(id) });
		},
	});
}
