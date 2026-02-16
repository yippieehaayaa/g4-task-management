import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, CreateRoleInput, Role } from "../../../types";
import { roleKeys } from "../../queries/roles";

export function useCreateRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateRoleInput) =>
			api.post<ApiResponse<Role>>("/iam/roles", input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
		},
	});
}
