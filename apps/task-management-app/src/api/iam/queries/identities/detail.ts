import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Identity } from "../../../types";
import { identityKeys } from "./keys";

export const detailQuery = (id: string) =>
	queryOptions({
		queryKey: identityKeys.detail(id),
		queryFn: () => api.get<ApiResponse<Identity>>(`/iam/identities/${id}`),
	});
