import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../client";
import { authKeys } from "../../queries/auth";

export function useRevokeSession() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (sessionId: string) =>
			api.delete(`/iam/auth/sessions/${sessionId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
		},
	});
}
