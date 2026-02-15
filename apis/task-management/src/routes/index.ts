import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import main from "./main";
import tasks from "./tasks";

const router = Router();

router.use("/", main);
router.use("/tasks", authenticate, tasks);

export default router;
