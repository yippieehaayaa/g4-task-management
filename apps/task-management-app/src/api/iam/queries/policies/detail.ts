import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Policy } from "../../../types";
import { policyKeys } from "./keys";

export const detailQuery = (id: string) =>
	queryOptions({
		queryKey: policyKeys.detail(id),
		queryFn: () => api.get<ApiResponse<Policy>>(`/iam/policies/${id}`),
	});
