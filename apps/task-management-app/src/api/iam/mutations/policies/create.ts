import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, CreatePolicyInput, Policy } from "../../../types";
import { policyKeys } from "../../queries/policies";

export function useCreatePolicy() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreatePolicyInput) =>
			api.post<ApiResponse<Policy>>("/iam/policies", input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
		},
	});
}
