import { useMutation } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Identity, RegisterInput } from "../../../types";

export function useRegister() {
	return useMutation({
		mutationFn: (input: RegisterInput) =>
			api.post<ApiResponse<Identity>>("/iam/auth/register", input),
	});
}
