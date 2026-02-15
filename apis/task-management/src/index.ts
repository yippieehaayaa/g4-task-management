import http from "node:http";
import { prisma } from "@g4/db-task-management";
import { createLogger } from "@g4/logger";
import app from "./app";
import { env } from "./config";

const log = createLogger({ service: "task-management" });
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
  server.listen(env.PORT, () => {
    log.info(
      { port: env.PORT },
      "Task Management Service is listening at port",
    );
  });
};

start().catch((err) => {
  log.fatal(err, "Failed to start Task Management service");
  process.exit(1);
});
