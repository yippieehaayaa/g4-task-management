import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type {
	Identity,
	ListIdentitiesParams,
	PaginatedResponse,
} from "../../../types";
import { identityKeys } from "./keys";

export const listQuery = (params?: ListIdentitiesParams) =>
	queryOptions({
		queryKey: identityKeys.list(params),
		queryFn: () =>
			api.get<PaginatedResponse<Identity>>(
				"/iam/identities",
				params as Record<string, unknown>,
			),
	});
