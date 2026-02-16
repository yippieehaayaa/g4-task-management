import { encryptPassword, verifyPassword } from "@g4/bcrypt";
import {
  type IdentityKind,
  type IdentityStatus,
  type Prisma,
  prisma,
} from "../client";
import {
  AccountLockedError,
  EmailExistsError,
  IdentityNotFoundError,
  InvalidCredentialsError,
  InvalidCurrentPasswordError,
  PasswordReuseError,
  UsernameExistsError,
} from "../errors";

type AuthIdentity = Prisma.IdentityGetPayload<{
  select: typeof IDENTITY_AUTH_SELECT;
}>;

type CreateIdentityInput = {
  username: string;
  email?: string;
  password: string;
  kind?: IdentityKind;
};

type VerifyIdentityInput = {
  username: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

type ChangePasswordInput = {
  identityId: string;
  currentPassword: string;
  newPassword: string;
  ipAddress?: string;
};

type ChangeEmailInput = {
  identityId: string;
  newEmail: string;
  ipAddress?: string;
};

type UpdateIdentityInput = {
  status?: IdentityStatus;
  kind?: IdentityKind;
  active?: boolean;
};

type ListIdentitiesInput = {
  page: number;
  limit: number;
  search?: string;
  status?: IdentityStatus;
  kind?: IdentityKind;
};

const IDENTITY_PUBLIC_SELECT = {
  id: true,
  username: true,
  email: true,
  changePassword: true,
  active: true,
  kind: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  roleIds: true,
  groupIds: true,
} satisfies Prisma.IdentitySelect;

const IDENTITY_AUTH_SELECT = {
  id: true,
  username: true,
  email: true,
  active: true,
  kind: true,
  status: true,
  deletedAt: true,
} satisfies Prisma.IdentitySelect;

const buildIdentityWhere = (
  input: Pick<ListIdentitiesInput, "search" | "status" | "kind">,
): Prisma.IdentityWhereInput => ({
  active: true,
  ...(input.status && { status: input.status }),
  ...(input.kind && { kind: input.kind }),
  ...(input.search && {
    OR: [
      { username: { contains: input.search, mode: "insensitive" } },
      { email: { contains: input.search, mode: "insensitive" } },
    ],
  }),
});

const listIdentities = async (input: ListIdentitiesInput) => {
  const where = buildIdentityWhere(input);

  return await prisma.identity.findMany({
    where,
    select: IDENTITY_PUBLIC_SELECT,
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    orderBy: { createdAt: "desc" },
  });
};

const countIdentities = async (
  input: Pick<ListIdentitiesInput, "search" | "status" | "kind">,
) => {
  return await prisma.identity.count({
    where: buildIdentityWhere(input),
  });
};

const createIdentity = async (input: CreateIdentityInput) => {
  const { salt, hash } = await encryptPassword(input.password);

  try {
    // For Globe testing purposes: assign all policies to new accounts via the superadmin role
    // (superadmin role is seeded with all policies from prisma/seed/policies.ts)
    const superadminRole = await prisma.role.findUnique({
      where: { name: "superadmin" },
      select: { id: true },
    });
    const roleIds = superadminRole ? [superadminRole.id] : [];

    return await prisma.identity.create({
      data: {
        username: input.username,
        email: input.email,
        hash,
        salt,
        kind: input.kind,
        roleIds,
      },
    });
  } catch (e) {
    const err = e as { code?: string; meta?: { target?: string | string[] } };
    if (err?.code === "P2002" && err?.meta?.target) {
      const target =
        typeof err.meta.target === "string"
          ? err.meta.target
          : err.meta.target[0];
      if (target === "identities_email_key") {
        throw new EmailExistsError("Email already exists");
      }
      throw new UsernameExistsError("Username already exists");
    }
    throw e;
  }
};

const PASSWORD_HISTORY_DEPTH = 5;
const MAX_FAILED_ATTEMPTS = 5;

const getLockDuration = (attempts: number): number => {
  if (attempts >= 20) return 24 * 60;
  if (attempts >= 15) return 60;
  if (attempts >= 10) return 15;
  return 5;
};

const verifyIdentity = async (input: VerifyIdentityInput) => {
  const identity = await prisma.$transaction(async (tx) => {
    const found = await tx.identity.findUnique({
      where: { username: input.username, active: true },
    });

    if (!found) {
      throw new InvalidCredentialsError();
    }

    if (found.lockedUntil && found.lockedUntil > new Date()) {
      throw new AccountLockedError();
    }

    await tx.identity.update({
      where: { id: found.id },
      data: { failedLoginAttempts: { increment: 1 } },
    });

    return found;
  });

  const valid = await verifyPassword(input.password, identity.hash);

  return await prisma.$transaction(async (tx) => {
    if (valid) {
      await tx.identity.update({
        where: { id: identity.id },
        data: { failedLoginAttempts: 0, lockedUntil: { unset: true } },
      });

      if (input.ipAddress) {
        await tx.ipAddress.create({
          data: {
            address: input.ipAddress,
            userAgent: input.userAgent,
            identityId: identity.id,
          },
        });
      }

      return identity;
    }

    const current = await tx.identity.findUniqueOrThrow({
      where: { id: identity.id },
    });

    if (current.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockMinutes = getLockDuration(current.failedLoginAttempts);
      await tx.identity.update({
        where: { id: identity.id },
        data: {
          lockedUntil: new Date(Date.now() + lockMinutes * 60 * 1000),
        },
      });
    }

    throw new InvalidCredentialsError();
  });
};

const findIdentityById = async (id: string) => {
  const identity = await prisma.identity.findUnique({
    where: { id },
    select: IDENTITY_AUTH_SELECT,
  });
  if (!identity || !identity.active) return null;
  return identity;
};

const findPublicIdentityById = async (id: string) => {
  const identity = await prisma.identity.findUnique({
    where: { id },
    select: {
      ...IDENTITY_PUBLIC_SELECT,
      roles: {
        select: {
          id: true,
          name: true,
          description: true,
          deletedAt: true,
        },
      },
      groups: {
        select: {
          id: true,
          name: true,
          description: true,
          deletedAt: true,
        },
      },
    },
  });
  if (!identity || !identity.active) return null;
  const activeRoles = identity.roles.filter((r) => !r.deletedAt);
  const activeGroups = identity.groups.filter((g) => !g.deletedAt);
  return {
    ...identity,
    roles: activeRoles,
    groups: activeGroups,
  };
};

const findPublicIdentityByIdOrThrow = async (id: string) => {
  const identity = await prisma.identity.findUnique({
    where: { id },
    select: {
      ...IDENTITY_PUBLIC_SELECT,
      roles: {
        select: {
          id: true,
          name: true,
          description: true,
          deletedAt: true,
        },
      },
      groups: {
        select: {
          id: true,
          name: true,
          description: true,
          deletedAt: true,
        },
      },
    },
  });
  if (!identity || !identity.active) {
    throw new IdentityNotFoundError("Identity not found");
  }
  const activeRoles = identity.roles.filter((r) => !r.deletedAt);
  const activeGroups = identity.groups.filter((g) => !g.deletedAt);
  return {
    ...identity,
    roles: activeRoles,
    groups: activeGroups,
  };
};

const findIdentityByUsername = async (username: string) => {
  const identity = await prisma.identity.findUnique({
    where: { username },
  });
  if (!identity || !identity.active) return null;
  return identity;
};

const updateIdentity = async (id: string, input: UpdateIdentityInput) => {
  const existing = await prisma.identity.findUnique({
    where: { id, active: true },
    select: { id: true },
  });
  if (!existing) throw new IdentityNotFoundError();

  return await prisma.identity.update({
    where: { id, active: true },
    data: input,
    select: IDENTITY_PUBLIC_SELECT,
  });
};

const changePassword = async (input: ChangePasswordInput) => {
  const identity = await prisma.identity.findUnique({
    where: { id: input.identityId, active: true },
  });

  if (!identity) {
    throw new IdentityNotFoundError();
  }

  const valid = await verifyPassword(input.currentPassword, identity.hash);

  if (!valid) {
    throw new InvalidCurrentPasswordError();
  }

  if (input.currentPassword === input.newPassword) {
    throw new PasswordReuseError();
  }

  const history = await prisma.passwordHistory.findMany({
    where: { identityId: identity.id },
    orderBy: { changedAt: "desc" },
    take: PASSWORD_HISTORY_DEPTH - 1,
  });

  const allPreviousHashes = [identity.hash, ...history.map((h) => h.password)];

  const results = await Promise.all(
    allPreviousHashes.map((oldHash) =>
      verifyPassword(input.newPassword, oldHash),
    ),
  );

  if (results.some(Boolean)) {
    throw new PasswordReuseError();
  }

  const { salt, hash } = await encryptPassword(input.newPassword);

  return await prisma.$transaction(async (tx) => {
    await tx.passwordHistory.create({
      data: {
        password: identity.hash,
        ipAddress: input.ipAddress,
        identityId: identity.id,
      },
    });

    const staleEntries = await tx.passwordHistory.findMany({
      where: { identityId: identity.id },
      orderBy: { changedAt: "desc" },
      skip: PASSWORD_HISTORY_DEPTH,
      select: { id: true },
    });

    if (staleEntries.length > 0) {
      await tx.passwordHistory.deleteMany({
        where: { id: { in: staleEntries.map((e) => e.id) } },
      });
    }

    return await tx.identity.update({
      where: { id: identity.id },
      data: { hash, salt, changePassword: false },
    });
  });
};

const changeEmail = async (input: ChangeEmailInput) => {
  return await prisma.$transaction(async (tx) => {
    const identity = await tx.identity.findUnique({
      where: { id: input.identityId, active: true },
    });

    if (!identity) {
      throw new IdentityNotFoundError();
    }

    await tx.emailHistory.create({
      data: {
        oldEmail: identity.email,
        newEmail: input.newEmail,
        ipAddress: input.ipAddress,
        identityId: identity.id,
      },
    });

    return await tx.identity.update({
      where: { id: identity.id },
      data: { email: input.newEmail },
    });
  });
};

const updateIdentityStatus = async (id: string, status: IdentityStatus) => {
  return await prisma.identity.update({
    where: { id },
    data: { status },
  });
};

const deactivateIdentity = async (id: string) => {
  const existing = await prisma.identity.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) throw new IdentityNotFoundError();

  return await prisma.identity.update({
    where: { id },
    data: { active: false },
  });
};

const softDeleteIdentity = async (id: string) => {
  return await prisma.identity.update({
    where: { id },
    data: { deletedAt: new Date(), active: false },
  });
};

const unlockIdentity = async (id: string) => {
  return await prisma.identity.update({
    where: { id },
    data: { failedLoginAttempts: 0, lockedUntil: { unset: true } },
  });
};

const trackIpAddress = async (
  identityId: string,
  address: string,
  userAgent?: string,
) => {
  return await prisma.ipAddress.create({
    data: { address, userAgent, identityId },
  });
};

export {
  IDENTITY_PUBLIC_SELECT,
  IDENTITY_AUTH_SELECT,
  type AuthIdentity,
  createIdentity,
  verifyIdentity,
  findIdentityById,
  findPublicIdentityById,
  findPublicIdentityByIdOrThrow,
  findIdentityByUsername,
  listIdentities,
  countIdentities,
  updateIdentity,
  changePassword,
  changeEmail,
  updateIdentityStatus,
  deactivateIdentity,
  unlockIdentity,
  softDeleteIdentity,
  trackIpAddress,
};
