import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Otp } from "../../../types";
import { adminKeys } from "./keys";

export const otpsQuery = (identityId: string) =>
	queryOptions({
		queryKey: adminKeys.otps(identityId),
		queryFn: () =>
			api.get<ApiResponse<Otp[]>>(`/iam/admin/identities/${identityId}/otps`),
	});
