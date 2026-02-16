import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, CreateGroupInput, Group } from "../../../types";
import { groupKeys } from "../../queries/groups";

export function useCreateGroup() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateGroupInput) =>
			api.post<ApiResponse<Group>>("/iam/groups", input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
		},
	});
}
