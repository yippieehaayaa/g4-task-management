import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Role, UpdateRoleInput } from "../../../types";
import { roleKeys } from "../../queries/roles";

export function useUpdateRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, ...input }: UpdateRoleInput & { id: string }) =>
			api.patch<ApiResponse<Role>>(`/iam/roles/${id}`, input),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: roleKeys.detail(variables.id),
			});
		},
	});
}
