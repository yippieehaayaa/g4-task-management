import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional().default("3000"),
  DATABASE_URL: z.url(),
  JWT_ISSUER: z.string().min(1).default("g4-iam"),
  JWT_AUDIENCE: z.string().min(1).default("g4-services"),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY_HOURS: z.coerce.number().int().positive().default(168),
});

const env = envSchema.parse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY_HOURS: process.env.REFRESH_TOKEN_EXPIRY_HOURS,
});

export { env };
