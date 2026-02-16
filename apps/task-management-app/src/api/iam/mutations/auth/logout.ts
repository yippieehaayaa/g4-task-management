import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, clearTokens, getRefreshToken } from "../../../client";

export function useLogout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const token = getRefreshToken();
			if (!token) return;
			await api.post("/iam/auth/logout", { refreshToken: token });
		},
		onSettled: () => {
			clearTokens();
			queryClient.clear();
		},
	});
}
