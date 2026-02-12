import { errorHandler } from "@g4/error-handler";
import express from "express";
import routes from "./routes";

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.use(routes);

app.use(errorHandler);

export default app;
