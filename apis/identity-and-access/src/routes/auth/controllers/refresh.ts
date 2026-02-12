import {
  createSession,
  findActiveSessionByToken,
  findIdentityById,
  revokeSession as revokeSessionByToken,
} from "@g4/db-iam";
import { ForbiddenError, UnauthorizedError } from "@g4/error-handler";
import type { refreshTokenBodySchema } from "@g4/schemas/iam";
import { typedHandler } from "../../../utils/typedHandler";
import { env } from "../../../config";
import { resolvePermissions } from "../../../utils/permissions";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/token";
import type { z } from "zod";

type Body = z.infer<typeof refreshTokenBodySchema>;

const refresh = typedHandler<unknown, Body>(async (req, res) => {
  const session = await findActiveSessionByToken(req.body.refreshToken);

  if (!session) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const identity = await findIdentityById(session.identityId);

  if (!identity || !identity.active || identity.deletedAt) {
    throw new UnauthorizedError("Identity is inactive or deleted");
  }

  if (identity.status === "SUSPENDED" || identity.status === "INACTIVE") {
    throw new ForbiddenError("Account is not active");
  }

  await revokeSessionByToken(session.token, session.identityId);

  const permissions = await resolvePermissions(identity.id);

  const accessToken = await generateAccessToken({
    sub: identity.id,
    username: identity.username,
    kind: identity.kind,
    status: identity.status,
    permissions,
  });

  const refreshToken = generateRefreshToken();

  await createSession({
    token: refreshToken,
    identityId: identity.id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    expiresInHours: env.REFRESH_TOKEN_EXPIRY_HOURS,
  });

  res.json({
    data: {
      accessToken,
      refreshToken,
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    },
  });
});

export { refresh };
