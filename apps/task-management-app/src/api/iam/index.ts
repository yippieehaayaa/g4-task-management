// ── Queries ──────────────────────────────────────────────────────────────────

export { adminKeys, adminQueries } from "./queries/admin";
export { authKeys, authQueries } from "./queries/auth";
export { groupKeys, groupQueries } from "./queries/groups";
export { identityKeys, identityQueries } from "./queries/identities";
export { policyKeys, policyQueries } from "./queries/policies";
export { roleKeys, roleQueries } from "./queries/roles";

// ── Mutations ────────────────────────────────────────────────────────────────

export {
	useAdminRevokeAllSessions,
	useAdminRevokeSession,
	useExpireOtps,
	useUnlockIdentity,
} from "./mutations/admin";

export {
	useChangeEmail,
	useChangePassword,
	useLogin,
	useLogout,
	useRefreshToken,
	useRegister,
	useRevokeSession,
} from "./mutations/auth";

export {
	useAddIdentitiesToGroup,
	useAddRolesToGroup,
	useCreateGroup,
	useDeleteGroup,
	useRemoveIdentitiesFromGroup,
	useRemoveRolesFromGroup,
	useUpdateGroup,
} from "./mutations/groups";

export {
	useDeactivateIdentity,
	useDeleteIdentity,
	useUpdateIdentity,
} from "./mutations/identities";

export {
	useCreatePolicy,
	useDeletePolicy,
	useUpdatePolicy,
} from "./mutations/policies";

export {
	useAddPoliciesToRole,
	useAssignRoleToIdentity,
	useCreateRole,
	useDeleteRole,
	useRemovePoliciesFromRole,
	useRemoveRoleFromIdentity,
	useUpdateRole,
} from "./mutations/roles";
