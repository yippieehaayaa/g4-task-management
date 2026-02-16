import { useMutation } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ChangePasswordInput } from "../../../types";

export function useChangePassword() {
	return useMutation({
		mutationFn: (input: ChangePasswordInput) =>
			api.patch("/iam/auth/password", input),
	});
}
