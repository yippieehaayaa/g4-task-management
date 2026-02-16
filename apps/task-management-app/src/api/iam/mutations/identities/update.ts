import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Identity, UpdateIdentityInput } from "../../../types";
import { identityKeys } from "../../queries/identities";

export function useUpdateIdentity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, ...input }: UpdateIdentityInput & { id: string }) =>
			api.patch<ApiResponse<Identity>>(`/iam/identities/${id}`, input),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: identityKeys.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: identityKeys.detail(variables.id),
			});
		},
	});
}
