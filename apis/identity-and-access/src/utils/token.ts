import { randomBytes } from "node:crypto";
import { type AccessTokenPayload, signAccessToken } from "./jwt";

const generateAccessToken = async (
  payload: AccessTokenPayload,
): Promise<string> => {
  return signAccessToken(payload);
};

const generateRefreshToken = (): string => {
  return randomBytes(64).toString("base64url");
};

export { generateAccessToken, generateRefreshToken };
