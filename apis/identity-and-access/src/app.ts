import { errorHandler } from "@g4/error-handler";
import express from "express";
import { apiRateLimiter } from "./middlewares/rateLimiter";
import { requestId } from "./middlewares/requestId";
import routes from "./routes";

const app = express();

app.disable("x-powered-by");
app.use(requestId);
app.use(express.json({ limit: "16kb" }));
app.use(apiRateLimiter);

app.use(routes);

app.use(errorHandler);

export default app;
