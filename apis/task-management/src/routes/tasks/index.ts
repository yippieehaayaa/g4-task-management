import {
  createTaskSchema,
  listTasksQuerySchema,
  objectIdParamSchema,
  updateTaskSchema,
} from "@g4/schemas/task-management";
import { validateBody, validateParams, validateQuery } from "@g4/validate";
import { Router } from "express";
import { create } from "./controllers/create";
import { list } from "./controllers/list";
import { remove } from "./controllers/remove";
import { show } from "./controllers/show";
import { update } from "./controllers/update";

const router = Router();

router.get("/", validateQuery(listTasksQuerySchema), list);

router.post("/", validateBody(createTaskSchema), create);

router.get("/:id", validateParams(objectIdParamSchema), show);

router.patch(
  "/:id",
  validateParams(objectIdParamSchema),
  validateBody(updateTaskSchema),
  update,
);

router.delete("/:id", validateParams(objectIdParamSchema), remove);

export default router;
