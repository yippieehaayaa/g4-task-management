import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { adminKeys } from "../../queries/admin";

export function useAdminRevokeAllSessions() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (identityId: string) =>
			api.delete(`/iam/admin/identities/${identityId}/sessions`),
		onSuccess: (_data, identityId) => {
			queryClient.invalidateQueries({
				queryKey: adminKeys.sessions(identityId),
			});
		},
	});
}
