import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { adminKeys } from "../../queries/admin";

export function useAdminRevokeSession() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			identityId,
			sessionId,
		}: { identityId: string; sessionId: string }) =>
			api.delete(
				`/iam/admin/identities/${identityId}/sessions/${sessionId}`,
			),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: adminKeys.sessions(variables.identityId),
			});
		},
	});
}
