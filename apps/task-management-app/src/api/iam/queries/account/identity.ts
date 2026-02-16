import { api } from "../../../client";
import type { ApiResponse, Identity } from "../../../types";

export const accountKeys = {
	all: ["account"] as const,
	identity: () => [...accountKeys.all, "identity"] as const,
};

export async function getAccountIdentity(): Promise<ApiResponse<Identity>> {
	return api.get<ApiResponse<Identity>>("/iam/account/identity");
}
