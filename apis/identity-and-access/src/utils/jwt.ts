import type { JWTPayload } from "jose";
import { exportJWK, generateKeyPair, jwtVerify, SignJWT } from "jose";
import { env } from "../config";

const ALG = "RS256" as const;
const KID = "iam-primary";

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
  const keyPair = await generateKeyPair(ALG, { extractable: true });
  privateKey = keyPair.privateKey;
  publicKey = keyPair.publicKey;

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
