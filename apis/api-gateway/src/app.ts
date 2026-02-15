import { errorHandler, notFoundHandler } from "@g4/error-handler";
import { logger } from "@g4/logger";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRateLimiter } from "./middlewares/rateLimiter";
import { requestId } from "./middlewares/requestId";
import routes from "./routes";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);
app.use(requestId);
app.use(apiRateLimiter);

/**
 * IMPORTANT: No express.json() body parser at the gateway level.
 *
 * The gateway streams request bodies as-is to downstream services.
 * Parsing bodies here would add unnecessary latency, increase memory usage,
 * and risk content-length mismatches when the body is re-serialized.
 *
 * Body parsing is the responsibility of each downstream service.
 */

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
