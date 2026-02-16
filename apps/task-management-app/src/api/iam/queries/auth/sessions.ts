import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Session } from "../../../types";
import { authKeys } from "./keys";

export const sessionsQuery = () =>
	queryOptions({
		queryKey: authKeys.sessions(),
		queryFn: () => api.get<ApiResponse<Session[]>>("/iam/auth/sessions"),
	});
