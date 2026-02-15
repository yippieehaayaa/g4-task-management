import { hmac } from "@g4/crypto";
import { type Prisma, prisma } from "../client";
import { SessionNotFoundError } from "../errors";

type CreateSessionInput = {
  token: string;
  identityId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresInHours?: number;
};

const toTokenHash = (raw: string): string => hmac((raw ?? "").trim());

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
      token: toTokenHash(input.token),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      expiresAt,
      identityId: input.identityId,
    },
  });
};

const findSessionByToken = async (token: string, identityId: string) => {
  return await prisma.session.findFirst({
    where: {
      token: toTokenHash(token),
      identityId,
      revokedAt: { isSet: false },
      expiresAt: { gt: new Date() },
    },
  });
};

const findActiveSessionByToken = async (token: string) => {
  const tokenHash = toTokenHash(token);

  return await prisma.session.findFirst({
    where: {
      token: tokenHash,
      revokedAt: { isSet: false },
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
      revokedAt: { isSet: false },
      expiresAt: { gt: new Date() },
    },
    select: SESSION_PUBLIC_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

const revokeSession = async (token: string, identityId: string) => {
  const hash = toTokenHash(token);
  const result = await prisma.session.updateMany({
    where: { token: hash, identityId, revokedAt: { isSet: false } },
    data: { revokedAt: new Date() },
  });
  if (result.count === 0) throw new SessionNotFoundError();
};

const revokeSessionById = async (id: string, identityId: string) => {
  const session = await prisma.session.findFirst({
    where: { id, identityId },
  });
  if (!session) throw new SessionNotFoundError();

  return await prisma.session.update({
    where: { id, identityId },
    data: { revokedAt: new Date() },
  });
};

const revokeAllSessions = async (identityId: string) => {
  return await prisma.session.updateMany({
    where: { identityId, revokedAt: { isSet: false } },
    data: { revokedAt: new Date() },
  });
};

const cleanExpiredSessions = async () => {
  return await prisma.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { isSet: true } }],
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
