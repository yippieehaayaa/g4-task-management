import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { adminKeys } from "../../queries/admin";

export function useExpireOtps() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (identityId: string) =>
			api.post(`/iam/admin/identities/${identityId}/otps/expire`),
		onSuccess: (_data, identityId) => {
			queryClient.invalidateQueries({
				queryKey: adminKeys.otps(identityId),
			});
		},
	});
}
