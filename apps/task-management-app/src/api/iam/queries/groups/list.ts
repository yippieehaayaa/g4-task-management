import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type {
	Group,
	PaginatedResponse,
	PaginationParams,
} from "../../../types";
import { groupKeys } from "./keys";

export const listQuery = (params?: PaginationParams) =>
	queryOptions({
		queryKey: groupKeys.list(params),
		queryFn: () =>
			api.get<PaginatedResponse<Group>>(
				"/iam/groups",
				params as Record<string, unknown>,
			),
	});
