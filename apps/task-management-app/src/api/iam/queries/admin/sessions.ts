import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Session } from "../../../types";
import { adminKeys } from "./keys";

export const sessionsQuery = (identityId: string) =>
	queryOptions({
		queryKey: adminKeys.sessions(identityId),
		queryFn: () =>
			api.get<ApiResponse<Session[]>>(
				`/iam/admin/identities/${identityId}/sessions`,
			),
	});
