import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Policy, UpdatePolicyInput } from "../../../types";
import { policyKeys } from "../../queries/policies";

export function useUpdatePolicy() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, ...input }: UpdatePolicyInput & { id: string }) =>
			api.patch<ApiResponse<Policy>>(`/iam/policies/${id}`, input),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: policyKeys.detail(variables.id),
			});
		},
	});
}
