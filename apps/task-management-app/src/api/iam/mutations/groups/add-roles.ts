import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Group } from "../../../types";
import { groupKeys } from "../../queries/groups";

export function useAddRolesToGroup() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, roleIds }: { id: string; roleIds: string[] }) =>
			api.post<ApiResponse<Group>>(`/iam/groups/${id}/roles`, {
				roleIds,
			}),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: groupKeys.detail(variables.id),
			});
			queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
	});
}
