import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Identity } from "../../../types";
import { identityKeys } from "../../queries/identities";

export function useDeactivateIdentity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) =>
			api.post<ApiResponse<Identity>>(`/iam/identities/${id}/deactivate`),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({
				queryKey: identityKeys.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: identityKeys.detail(id),
			});
		},
	});
}
