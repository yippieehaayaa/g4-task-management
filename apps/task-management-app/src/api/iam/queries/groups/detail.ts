import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Group } from "../../../types";
import { groupKeys } from "./keys";

export const detailQuery = (id: string) =>
	queryOptions({
		queryKey: groupKeys.detail(id),
		queryFn: () => api.get<ApiResponse<Group>>(`/iam/groups/${id}`),
	});
