import http from "node:http";

import app from "./app";
import { env } from "./config";
import { initializeKeys } from "./utils/jwt";

const server = http.createServer(app);

initializeKeys();

server.listen(env.PORT, () => {
  console.log(`IAM service listening on port ${env.PORT}`);
});
