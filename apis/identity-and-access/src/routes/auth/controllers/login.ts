import { createSession, verifyIdentity } from "@g4/db-iam";
import { ForbiddenError } from "@g4/error-handler";
import type { loginSchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { env } from "../../../config";
import { audit } from "../../../utils/audit";
import { mapDbIamError } from "../../../utils/mapError";
import { resolvePermissions } from "../../../utils/permissions";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/token";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof loginSchema>;

const login = typedHandler<unknown, Body>(async (req, res) => {
  let identity: Awaited<ReturnType<typeof verifyIdentity>>;

  try {
    identity = await verifyIdentity({
      username: res.locals.body.username,
      password: res.locals.body.password,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    const mapped = mapDbIamError(error);
    if (mapped) {
      audit({
        event: "identity.login.failed",
        ip: req.ip,
        requestId: req.id,
        userAgent: req.headers["user-agent"],
        metadata: {
          username: res.locals.body.username,
          reason:
            mapped.status === 429 ? "account_locked" : "invalid_credentials",
        },
      });
      throw mapped;
    }
    throw error;
  }

  if (identity.status === "SUSPENDED" || identity.status === "INACTIVE") {
    throw new ForbiddenError("Account is not active");
  }

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

  audit({
    event: "identity.login",
    actorId: identity.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
  });

  res.json({
    data: {
      accessToken,
      refreshToken,
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    },
  });
});

export { login };
