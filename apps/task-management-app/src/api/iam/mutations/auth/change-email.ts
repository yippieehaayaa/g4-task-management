import { useMutation } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ChangeEmailInput } from "../../../types";

export function useChangeEmail() {
	return useMutation({
		mutationFn: (input: ChangeEmailInput) =>
			api.patch("/iam/auth/email", input),
	});
}
