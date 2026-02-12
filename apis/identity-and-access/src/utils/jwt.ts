import { readFile } from "node:fs/promises";
import { createLogger } from "@g4/logger";
import type { JWTPayload } from "jose";
import {
  exportJWK,
  generateKeyPair,
  importPKCS8,
  importSPKI,
  jwtVerify,
  SignJWT,
} from "jose";
import { env } from "../config";

const ALG = "RS256" as const;
const KID = "iam-primary";

const log = createLogger({ service: "identity-and-access", module: "jwt" });

let privateKey: CryptoKey;
let publicKey: CryptoKey;
let jwks: { keys: object[] };

type AccessTokenPayload = {
  sub: string;
  username: string;
  kind: string;
  status: string;
  permissions: string[];
};

const initializeKeys = async (): Promise<void> => {
  if (env.JWT_PRIVATE_KEY_PATH && env.JWT_PUBLIC_KEY_PATH) {
    const [privatePem, publicPem] = await Promise.all([
      readFile(env.JWT_PRIVATE_KEY_PATH, "utf-8"),
      readFile(env.JWT_PUBLIC_KEY_PATH, "utf-8"),
    ]);

    privateKey = await importPKCS8(privatePem, ALG);
    publicKey = await importSPKI(publicPem, ALG);

    log.info("Loaded JWT keys from files");
  } else if (env.NODE_ENV === "production") {
    throw new Error(
      "JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH are required in production",
    );
  } else {
    const keyPair = await generateKeyPair(ALG, { extractable: true });
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;

    log.warn("Using ephemeral JWT keys (development only)");
  }

  const publicJwk = await exportJWK(publicKey);
  jwks = {
    keys: [{ ...publicJwk, alg: ALG, use: "sig", kid: KID }],
  };
};

const signAccessToken = async (
  payload: AccessTokenPayload,
): Promise<string> => {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: ALG, typ: "JWT", kid: KID })
    .setIssuedAt()
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setExpirationTime(env.ACCESS_TOKEN_EXPIRY)
    .sign(privateKey);
};

const verifyAccessToken = async (
  token: string,
): Promise<JWTPayload & AccessTokenPayload> => {
  const { payload } = await jwtVerify(token, publicKey, {
    algorithms: [ALG],
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  return payload as JWTPayload & AccessTokenPayload;
};

const getJwks = () => jwks;

export {
  initializeKeys,
  signAccessToken,
  verifyAccessToken,
  getJwks,
  type AccessTokenPayload,
};
