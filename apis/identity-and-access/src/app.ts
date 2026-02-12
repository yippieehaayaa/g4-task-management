import { errorHandler } from "@g4/error-handler";
import express from "express";
import { mainRoutes } from "./routes/main";

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.use("/", mainRoutes);

app.use(errorHandler);

export default app;
