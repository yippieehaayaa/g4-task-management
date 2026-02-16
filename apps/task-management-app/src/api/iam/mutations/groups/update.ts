import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Group, UpdateGroupInput } from "../../../types";
import { groupKeys } from "../../queries/groups";

export function useUpdateGroup() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, ...input }: UpdateGroupInput & { id: string }) =>
			api.patch<ApiResponse<Group>>(`/iam/groups/${id}`, input),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: groupKeys.detail(variables.id),
			});
		},
	});
}
