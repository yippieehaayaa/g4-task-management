import { encryptPassword, verifyPassword } from "@g4/bcrypt";
import { type IdentityKind, type IdentityStatus, prisma } from "../client";

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

const findIdentityByUsername = async (username: string) => {
  return await prisma.identity.findUnique({
    where: { username, deletedAt: null },
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
  createIdentity,
  verifyIdentity,
  findIdentityById,
  findIdentityByUsername,
  changePassword,
  changeEmail,
  updateIdentityStatus,
  deactivateIdentity,
  softDeleteIdentity,
  trackIpAddress,
};
