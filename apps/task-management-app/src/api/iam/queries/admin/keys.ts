export const adminKeys = {
	all: ["admin"] as const,
	sessions: (identityId: string) =>
		[...adminKeys.all, "sessions", identityId] as const,
	otps: (identityId: string) =>
		[...adminKeys.all, "otps", identityId] as const,
};
