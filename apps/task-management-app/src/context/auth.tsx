import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
import { getAccessToken } from "@/api";
import { getAccountIdentity } from "@/api/iam/queries/account/identity";
import { useLogin, useLogout } from "@/api";
import type { Identity } from "@/api/types";

/** Query key for the current user. Use for invalidate/refetch after login. */
export const authMeQueryKey = ["auth", "me"] as const;

/** @deprecated Use Identity from @/api/types. Kept for compatibility. */
export type User = Identity;

interface AuthContextType {
	user: Identity | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const loginMutation = useLogin();
	const logoutMutation = useLogout();

	const {
		data: user,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: authMeQueryKey,
		queryFn: async () => {
			try {
				const response = await getAccountIdentity();
				return response.data;
			} catch (_error) {
				return null;
			}
		},
		enabled: !!getAccessToken(),
		retry: false,
		staleTime: 5 * 60 * 1000,
	});

	const isAuthenticated = useMemo(() => !!user, [user]);

	const login = useCallback(
		async (username: string, password: string) => {
			// Only throw on actual login failure (bad credentials). Tokens are set in mutation onSuccess.
			await loginMutation.mutateAsync({ username, password });
			// Best-effort refetch so user is in cache before navigation; don't throw if it fails.
			// After navigation, the auth query will run again (enabled by token) and can succeed then.
			await refetch();
		},
		[loginMutation, refetch],
	);

	const logout = useCallback(async () => {
		try {
			await logoutMutation.mutateAsync();
			queryClient.clear();
		} catch (error) {
			console.error("Logout failed:", error);
			queryClient.clear();
		}
	}, [logoutMutation, queryClient]);

	const refetchUser = useCallback(async () => {
		await refetch();
	}, [refetch]);

	const value = useMemo(
		() => ({
			user: user ?? null,
			isLoading,
			isAuthenticated,
			login,
			logout,
			refetchUser,
		}),
		[user, isLoading, isAuthenticated, login, logout, refetchUser],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function withAuth<P extends object>(
	Component: React.ComponentType<P>,
): React.FC<P> {
	return function AuthenticatedComponent(props: P) {
		const { isAuthenticated, isLoading } = useAuth();

		if (isLoading) {
			return (
				<div className="flex h-screen items-center justify-center">
					<div className="text-lg">Loading...</div>
				</div>
			);
		}

		if (!isAuthenticated) {
			return (
				<div className="flex h-screen items-center justify-center">
					<div className="text-lg">Unauthorized. Please log in.</div>
				</div>
			);
		}

		return <Component {...props} />;
	};
}
