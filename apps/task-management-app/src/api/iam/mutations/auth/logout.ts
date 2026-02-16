import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, clearTokens, getRefreshToken } from "../../../client";

export function useLogout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => {
			const token = getRefreshToken();
			return api.post("/iam/auth/logout", { refreshToken: token });
		},
		onSettled: () => {
			clearTokens();
			queryClient.clear();
		},
	});
}
