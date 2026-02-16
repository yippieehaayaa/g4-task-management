import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Group } from "../../../types";
import { groupKeys } from "../../queries/groups";

export function useRemoveIdentitiesFromGroup() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, identityIds }: { id: string; identityIds: string[] }) =>
			api.delete<ApiResponse<Group>>(`/iam/groups/${id}/identities`, {
				identityIds,
			}),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: groupKeys.detail(variables.id),
			});
			queryClient.invalidateQueries({ queryKey: ["identities"] });
		},
	});
}
