import { createLogger } from "@g4/logger";
import type { JWTPayload } from "jose";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config";

const ALG = "RS256" as const;

const log = createLogger({ service: "task-management", module: "jwt" });

const jwks = createRemoteJWKSet(new URL(env.IAM_JWKS_URL));

type AccessTokenPayload = {
  sub: string;
  username: string;
  kind: string;
  status: string;
  permissions: string[];
};

const verifyAccessToken = async (
  token: string,
): Promise<JWTPayload & AccessTokenPayload> => {
  const { payload } = await jwtVerify(token, jwks, {
    algorithms: [ALG],
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  return payload as JWTPayload & AccessTokenPayload;
};

log.info({ jwksUrl: env.IAM_JWKS_URL }, "JWKS remote key set configured");

export { verifyAccessToken, type AccessTokenPayload };
