import { ApiError } from "./client";
import { getAccountIdentity } from "./iam/queries/account/identity";

export async function checkAuthStatus(): Promise<boolean> {
	try {
		await getAccountIdentity();
		return true;
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) return false;
		throw err;
	}
}

export const apiClient = {
	checkAuthStatus,
	iam: {
		account: {
			identity: getAccountIdentity,
		},
	},
};
