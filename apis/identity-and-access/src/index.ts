import http from "node:http";
import { createLogger } from "@g4/logger";
import app from "./app";
import { env } from "./config";
import { initializeKeys } from "./utils/jwt";

const log = createLogger({ service: "identity-and-access" });
const server = http.createServer(app);

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
