import { useMutation } from "@tanstack/react-query";
import { api, setTokens } from "../../../client";
import type { ApiResponse, AuthTokens, LoginInput } from "../../../types";

export function useLogin() {
	return useMutation({
		mutationFn: (input: LoginInput) =>
			api.post<ApiResponse<AuthTokens>>("/iam/auth/login", input),
		onSuccess: (data) => {
			setTokens(data.data.accessToken, data.data.refreshToken);
		},
	});
}
