import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Role } from "../../../types";
import { roleKeys } from "../../queries/roles";

export function useRemovePoliciesFromRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, policyIds }: { id: string; policyIds: string[] }) =>
			api.delete<ApiResponse<Role>>(`/iam/roles/${id}/policies`, {
				policyIds,
			}),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: roleKeys.detail(variables.id),
			});
		},
	});
}
