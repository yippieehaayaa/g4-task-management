// ── Response Wrappers ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
	data: T;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: PaginationMeta;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
}

// ── Common Params ────────────────────────────────────────────────────────────

export interface PaginationParams {
	page?: number;
	limit?: number;
	search?: string;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	expiresIn: string;
}

export interface LoginInput {
	username: string;
	password: string;
}

export interface RegisterInput {
	username: string;
	password: string;
	email?: string;
	kind?: IdentityKind;
}

export interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
}

export interface ChangeEmailInput {
	newEmail: string;
}

// ── Identity ─────────────────────────────────────────────────────────────────

export type IdentityStatus =
	| "ACTIVE"
	| "INACTIVE"
	| "SUSPENDED"
	| "PENDING_VERIFICATION";

export type IdentityKind = "USER" | "SERVICE" | "ADMIN";

export interface Identity {
	id: string;
	username: string;
	email?: string;
	active: boolean;
	kind: IdentityKind;
	status: IdentityStatus;
	changePassword: boolean;
	failedLoginAttempts: number;
	lockedUntil?: string;
	roleIds: string[];
	groupIds: string[];
	createdAt: string;
	updatedAt: string;
}

export interface ListIdentitiesParams extends PaginationParams {
	status?: IdentityStatus;
	kind?: IdentityKind;
}

export interface UpdateIdentityInput {
	status?: IdentityStatus;
	kind?: IdentityKind;
	active?: boolean;
}

// ── Role ─────────────────────────────────────────────────────────────────────

export interface Role {
	id: string;
	name: string;
	description?: string;
	policyIds: string[];
	identityIds: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateRoleInput {
	name: string;
	description?: string;
}

export interface UpdateRoleInput {
	name?: string;
	description?: string;
}

// ── Policy ───────────────────────────────────────────────────────────────────

export type PolicyEffect = "ALLOW" | "DENY";

export interface Policy {
	id: string;
	name: string;
	description?: string;
	effect: PolicyEffect;
	actions: string[];
	resources: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreatePolicyInput {
	name: string;
	description?: string;
	effect: PolicyEffect;
	actions: string[];
	resources: string[];
}

export interface UpdatePolicyInput {
	name?: string;
	description?: string;
	effect?: PolicyEffect;
	actions?: string[];
	resources?: string[];
}

// ── Group ────────────────────────────────────────────────────────────────────

export interface Group {
	id: string;
	name: string;
	description?: string;
	identityIds: string[];
	roleIds: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateGroupInput {
	name: string;
	description?: string;
}

export interface UpdateGroupInput {
	name?: string;
	description?: string;
}

// ── Session ──────────────────────────────────────────────────────────────────

export interface Session {
	id: string;
	identityId: string;
	ipAddress?: string;
	userAgent?: string;
	expiresAt: string;
	revokedAt?: string;
	createdAt: string;
}

// ── OTP ──────────────────────────────────────────────────────────────────────

export type OtpPurpose =
	| "REGISTRATION"
	| "LOGIN"
	| "PASSWORD_RESET"
	| "EMAIL_VERIFICATION";

export type OtpStatus = "PENDING" | "VERIFIED" | "EXPIRED";

export interface Otp {
	id: string;
	identityId: string;
	purpose: OtpPurpose;
	status: OtpStatus;
	expiresAt: string;
	attempts: number;
	createdAt: string;
}

// ── Task ─────────────────────────────────────────────────────────────────────

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
	id: string;
	title: string;
	description: string | null;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate: string | null;
	identityId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ListTasksParams extends PaginationParams {
	status?: TaskStatus;
	priority?: TaskPriority;
}

export interface CreateTaskInput {
	title: string;
	description?: string;
	status?: TaskStatus;
	priority?: TaskPriority;
	dueDate?: string;
}

export interface UpdateTaskInput {
	title?: string;
	description?: string | null;
	status?: TaskStatus;
	priority?: TaskPriority;
	dueDate?: string | null;
}
