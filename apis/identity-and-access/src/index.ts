import http from "node:http";
import { prisma } from "@g4/db-iam";
import { createLogger } from "@g4/logger";
import app from "./app";
import { env } from "./config";
import { initializeKeys } from "./utils/jwt";

const log = createLogger({ service: "identity-and-access" });
const server = http.createServer(app);

const shutdown = async (signal: string) => {
  log.info({ signal }, "Shutdown signal received");

  server.close(() => {
    log.info("HTTP server closed");
  });

  await prisma.$disconnect();
  log.info("Database connection closed");

  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

const start = async () => {
  await initializeKeys();

  server.listen(env.PORT, () => {
    log.info({ port: env.PORT }, "IAM service started");
  });
};

start().catch((err) => {
  log.fatal(err, "Failed to start IAM service");
  process.exit(1);
});
