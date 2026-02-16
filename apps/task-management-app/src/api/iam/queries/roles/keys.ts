import type { PaginationParams } from "../../../types";

export const roleKeys = {
	all: ["roles"] as const,
	lists: () => [...roleKeys.all, "list"] as const,
	list: (params?: PaginationParams) =>
		[...roleKeys.lists(), params] as const,
	details: () => [...roleKeys.all, "detail"] as const,
	detail: (id: string) => [...roleKeys.details(), id] as const,
};
