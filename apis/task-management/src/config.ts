import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().optional().default("3001"),
  DATABASE_URL: z.url(),
  JWT_ISSUER: z.string().min(1).default("g4-iam"),
  JWT_AUDIENCE: z.string().min(1).default("g4-services"),
  IAM_JWKS_URL: z.url().default("http://localhost:3000/.well-known/jwks.json"),
});

const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,
  IAM_JWKS_URL: process.env.IAM_JWKS_URL,
});

export { env };
