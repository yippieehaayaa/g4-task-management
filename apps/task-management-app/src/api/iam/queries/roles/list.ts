import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type {
	PaginatedResponse,
	PaginationParams,
	Role,
} from "../../../types";
import { roleKeys } from "./keys";

export const listQuery = (params?: PaginationParams) =>
	queryOptions({
		queryKey: roleKeys.list(params),
		queryFn: () =>
			api.get<PaginatedResponse<Role>>(
				"/iam/roles",
				params as Record<string, unknown>,
			),
	});
