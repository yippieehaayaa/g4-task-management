import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().optional().default("4000"),

  // Downstream service URLs
  IAM_SERVICE_URL: z.url().default("http://localhost:3000"),
  TM_SERVICE_URL: z.url().default("http://localhost:3001"),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),

  // Circuit breaker
  CB_FAILURE_THRESHOLD: z.coerce.number().int().positive().default(5),
  CB_RESET_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  CB_HALF_OPEN_MAX: z.coerce.number().int().positive().default(3),

  // Proxy
  PROXY_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
});

const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  IAM_SERVICE_URL: process.env.IAM_SERVICE_URL,
  TM_SERVICE_URL: process.env.TM_SERVICE_URL,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
  CB_FAILURE_THRESHOLD: process.env.CB_FAILURE_THRESHOLD,
  CB_RESET_TIMEOUT_MS: process.env.CB_RESET_TIMEOUT_MS,
  CB_HALF_OPEN_MAX: process.env.CB_HALF_OPEN_MAX,
  PROXY_TIMEOUT_MS: process.env.PROXY_TIMEOUT_MS,
});

export { env };
