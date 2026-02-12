import { type Prisma, prisma } from "../client";

type CreateSessionInput = {
  token: string;
  identityId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresInHours?: number;
};

const SESSION_PUBLIC_SELECT = {
  id: true,
  ipAddress: true,
  userAgent: true,
  createdAt: true,
  expiresAt: true,
  revokedAt: true,
  identityId: true,
} satisfies Prisma.SessionSelect;

const createSession = async (input: CreateSessionInput) => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + (input.expiresInHours ?? 24));

  return await prisma.session.create({
    data: {
      token: input.token,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      expiresAt,
      identityId: input.identityId,
    },
  });
};

const findSessionByToken = async (token: string, identityId: string) => {
  return await prisma.session.findUnique({
    where: {
      token,
      identityId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
};

const findActiveSessionByToken = async (token: string) => {
  return await prisma.session.findUnique({
    where: {
      token,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
};

const findSessionById = async (id: string) => {
  return await prisma.session.findUnique({
    where: { id },
    select: SESSION_PUBLIC_SELECT,
  });
};

const listSessionsByIdentity = async (identityId: string) => {
  return await prisma.session.findMany({
    where: {
      identityId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: SESSION_PUBLIC_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

const revokeSession = async (token: string, identityId: string) => {
  return await prisma.session.update({
    where: { token, identityId },
    data: { revokedAt: new Date() },
  });
};

const revokeSessionById = async (id: string, identityId: string) => {
  return await prisma.session.update({
    where: { id, identityId },
    data: { revokedAt: new Date() },
  });
};

const revokeAllSessions = async (identityId: string) => {
  return await prisma.session.updateMany({
    where: { identityId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

const cleanExpiredSessions = async () => {
  return await prisma.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
    },
  });
};

export {
  SESSION_PUBLIC_SELECT,
  createSession,
  findSessionByToken,
  findActiveSessionByToken,
  findSessionById,
  listSessionsByIdentity,
  revokeSession,
  revokeSessionById,
  revokeAllSessions,
  cleanExpiredSessions,
};
