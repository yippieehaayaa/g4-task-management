const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// ── Token Store ──────────────────────────────────────────────────────────────

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setTokens(access: string, refresh: string) {
	accessToken = access;
	refreshToken = refresh;
}

export function getAccessToken() {
	return accessToken;
}

export function getRefreshToken() {
	return refreshToken;
}

export function clearTokens() {
	accessToken = null;
	refreshToken = null;
}

// ── Error ────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly statusText: string,
		public readonly body?: unknown,
	) {
		super(`${status} ${statusText}`);
		this.name = "ApiError";
	}
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildQueryString(params?: Record<string, unknown>): string {
	if (!params) return "";
	const entries = Object.entries(params).filter(
		([, v]) => v !== undefined && v !== null,
	);
	if (entries.length === 0) return "";
	const sp = new URLSearchParams();
	for (const [k, v] of entries) sp.append(k, String(v));
	return `?${sp.toString()}`;
}

async function attemptRefresh(): Promise<boolean> {
	if (!refreshToken) return false;
	if (refreshPromise) return refreshPromise;

	refreshPromise = (async () => {
		try {
			const res = await fetch(`${API_URL}/iam/auth/refresh`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refreshToken }),
			});
			if (!res.ok) return false;
			const json = (await res.json()) as {
				data: { accessToken: string; refreshToken: string };
			};
			setTokens(json.data.accessToken, json.data.refreshToken);
			return true;
		} catch {
			return false;
		} finally {
			refreshPromise = null;
		}
	})();

	return refreshPromise;
}

// ── Core Request ─────────────────────────────────────────────────────────────

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
	const headers: Record<string, string> = {};

	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}
	if (init.body) {
		headers["Content-Type"] = "application/json";
	}

	let response = await fetch(`${API_URL}${path}`, { ...init, headers });

	if (response.status === 401 && refreshToken) {
		const refreshed = await attemptRefresh();
		if (refreshed) {
			headers.Authorization = `Bearer ${accessToken}`;
			response = await fetch(`${API_URL}${path}`, { ...init, headers });
		} else {
			clearTokens();
			throw new ApiError(401, "Unauthorized");
		}
	}

	if (!response.ok) {
		let body: unknown;
		try {
			body = await response.json();
		} catch {
			/* response may not have a JSON body */
		}
		throw new ApiError(response.status, response.statusText, body);
	}

	if (response.status === 204) return undefined as T;
	return response.json() as Promise<T>;
}

// ── Public API ───────────────────────────────────────────────────────────────

export const api = {
	get: <T>(path: string, params?: Record<string, unknown>) =>
		request<T>(`${path}${buildQueryString(params)}`),

	post: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: "POST",
			body: body !== undefined ? JSON.stringify(body) : undefined,
		}),

	patch: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: "PATCH",
			body: body !== undefined ? JSON.stringify(body) : undefined,
		}),

	delete: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: "DELETE",
			body: body !== undefined ? JSON.stringify(body) : undefined,
		}),
};
