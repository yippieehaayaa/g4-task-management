import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { identityKeys } from "../../queries/identities";

export function useDeleteIdentity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => api.delete(`/iam/identities/${id}`),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({
				queryKey: identityKeys.lists(),
			});
			queryClient.removeQueries({
				queryKey: identityKeys.detail(id),
			});
		},
	});
}
