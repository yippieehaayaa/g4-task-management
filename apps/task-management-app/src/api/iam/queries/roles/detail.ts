import { queryOptions } from "@tanstack/react-query";
import { api } from "../../../client";
import type { ApiResponse, Role } from "../../../types";
import { roleKeys } from "./keys";

export const detailQuery = (id: string) =>
	queryOptions({
		queryKey: roleKeys.detail(id),
		queryFn: () => api.get<ApiResponse<Role>>(`/iam/roles/${id}`),
	});
