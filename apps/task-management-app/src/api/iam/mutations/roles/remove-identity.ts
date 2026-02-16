import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { roleKeys } from "../../queries/roles";

export function useRemoveRoleFromIdentity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			identityId,
		}: { id: string; identityId: string }) =>
			api.delete(`/iam/roles/${id}/identities`, { identityId }),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: roleKeys.detail(variables.id),
			});
			queryClient.invalidateQueries({ queryKey: ["identities"] });
		},
	});
}
