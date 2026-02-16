import { useMutation } from "@tanstack/react-query";
import { api, setTokens } from "../../../client";
import type { ApiResponse, AuthTokens } from "../../../types";

export function useRefreshToken() {
	return useMutation({
		mutationFn: (token: string) =>
			api.post<ApiResponse<AuthTokens>>("/iam/auth/refresh", {
				refreshToken: token,
			}),
		onSuccess: (data) => {
			setTokens(data.data.accessToken, data.data.refreshToken);
		},
	});
}
