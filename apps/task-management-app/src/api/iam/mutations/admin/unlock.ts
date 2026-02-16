import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";

export function useUnlockIdentity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (identityId: string) =>
			api.post(`/iam/admin/identities/${identityId}/unlock`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["identities"] });
		},
	});
}
