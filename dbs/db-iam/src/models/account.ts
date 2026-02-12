import { encryptPassword, verifyPassword } from "@g4/bcrypt";
import {
  type IdentityKind,
  type IdentityStatus,
  type Prisma,
  prisma,
} from "../client";

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

const buildIdentityWhere = (
  input: Pick<ListIdentitiesInput, "search" | "status" | "kind">,
): Prisma.IdentityWhereInput => ({
  deletedAt: null,
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

  return await prisma.identity.create({
    data: {
      username: input.username,
      email: input.email,
      hash,
      salt,
      kind: input.kind,
    },
  });
};

const verifyIdentity = async (input: VerifyIdentityInput) => {
  return await prisma.$transaction(async (tx) => {
    const identity = await tx.identity.findUnique({
      where: { username: input.username, active: true, deletedAt: null },
    });

    if (!identity) {
      throw new Error("Invalid credentials");
    }

    const valid = await verifyPassword(input.password, identity.hash);

    if (!valid) {
      throw new Error("Invalid credentials");
    }

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
  });
};

const findIdentityById = async (id: string) => {
  return await prisma.identity.findUnique({
    where: { id, deletedAt: null },
  });
};

const findPublicIdentityById = async (id: string) => {
  return await prisma.identity.findUnique({
    where: { id, deletedAt: null },
    select: {
      ...IDENTITY_PUBLIC_SELECT,
      roles: { where: { deletedAt: null } },
      groups: { where: { deletedAt: null } },
    },
  });
};

const findIdentityByUsername = async (username: string) => {
  return await prisma.identity.findUnique({
    where: { username, deletedAt: null },
  });
};

const updateIdentity = async (id: string, input: UpdateIdentityInput) => {
  return await prisma.identity.update({
    where: { id, deletedAt: null },
    data: input,
    select: IDENTITY_PUBLIC_SELECT,
  });
};

const changePassword = async (input: ChangePasswordInput) => {
  return await prisma.$transaction(async (tx) => {
    const identity = await tx.identity.findUnique({
      where: { id: input.identityId, deletedAt: null },
    });

    if (!identity) {
      throw new Error("Identity not found");
    }

    const valid = await verifyPassword(input.currentPassword, identity.hash);

    if (!valid) {
      throw new Error("Invalid current password");
    }

    const { salt, hash } = await encryptPassword(input.newPassword);

    await tx.passwordHistory.create({
      data: {
        password: identity.hash,
        ipAddress: input.ipAddress,
        identityId: identity.id,
      },
    });

    return await tx.identity.update({
      where: { id: identity.id },
      data: { hash, salt, changePassword: false },
    });
  });
};

const changeEmail = async (input: ChangeEmailInput) => {
  return await prisma.$transaction(async (tx) => {
    const identity = await tx.identity.findUnique({
      where: { id: input.identityId, deletedAt: null },
    });

    if (!identity) {
      throw new Error("Identity not found");
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
    where: { id, deletedAt: null },
    data: { status },
  });
};

const deactivateIdentity = async (id: string) => {
  return await prisma.identity.update({
    where: { id, deletedAt: null },
    data: { active: false },
  });
};

const softDeleteIdentity = async (id: string) => {
  return await prisma.identity.update({
    where: { id },
    data: { deletedAt: new Date(), active: false },
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
  createIdentity,
  verifyIdentity,
  findIdentityById,
  findPublicIdentityById,
  findIdentityByUsername,
  listIdentities,
  countIdentities,
  updateIdentity,
  changePassword,
  changeEmail,
  updateIdentityStatus,
  deactivateIdentity,
  softDeleteIdentity,
  trackIpAddress,
};
