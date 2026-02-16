import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type {
	PaginatedResponse,
	PaginationParams,
	Policy,
} from "../../../types";
import { policyKeys } from "./keys";

export const listQuery = (params?: PaginationParams) =>
	queryOptions({
		queryKey: policyKeys.list(params),
		queryFn: () =>
			api.get<PaginatedResponse<Policy>>(
				"/iam/policies",
				params as Record<string, unknown>,
			),
	});
