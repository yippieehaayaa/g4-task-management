import type { ListIdentitiesParams } from "../../../types";

export const identityKeys = {
	all: ["identities"] as const,
	lists: () => [...identityKeys.all, "list"] as const,
	list: (params?: ListIdentitiesParams) =>
		[...identityKeys.lists(), params] as const,
	details: () => [...identityKeys.all, "detail"] as const,
	detail: (id: string) => [...identityKeys.details(), id] as const,
};
