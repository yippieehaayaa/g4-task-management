import type { PaginationParams } from "../../../types";

export const policyKeys = {
	all: ["policies"] as const,
	lists: () => [...policyKeys.all, "list"] as const,
	list: (params?: PaginationParams) => [...policyKeys.lists(), params] as const,
	details: () => [...policyKeys.all, "detail"] as const,
	detail: (id: string) => [...policyKeys.details(), id] as const,
};
