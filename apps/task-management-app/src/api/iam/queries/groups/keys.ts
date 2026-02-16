import type { PaginationParams } from "../../../types";

export const groupKeys = {
	all: ["groups"] as const,
	lists: () => [...groupKeys.all, "list"] as const,
	list: (params?: PaginationParams) =>
		[...groupKeys.lists(), params] as const,
	details: () => [...groupKeys.all, "detail"] as const,
	detail: (id: string) => [...groupKeys.details(), id] as const,
};
