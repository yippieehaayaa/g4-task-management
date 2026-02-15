import {
  createTaskSchema,
  listTasksQuerySchema,
  objectIdParamSchema,
  updateTaskSchema,
} from "@g4/schemas/task-management";
import { validateBody, validateParams, validateQuery } from "@g4/validate";
import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { create } from "./controllers/create";
import { list } from "./controllers/list";
import { remove } from "./controllers/remove";
import { show } from "./controllers/show";
import { update } from "./controllers/update";

const router = Router();

router.get(
  "/",
  authorize("tm:tasks:read"),
  validateQuery(listTasksQuerySchema),
  list,
);

router.post(
  "/",
  authorize("tm:tasks:write"),
  validateBody(createTaskSchema),
  create,
);

router.get(
  "/:id",
  authorize("tm:tasks:read"),
  validateParams(objectIdParamSchema),
  show,
);

router.patch(
  "/:id",
  authorize("tm:tasks:write"),
  validateParams(objectIdParamSchema),
  validateBody(updateTaskSchema),
  update,
);

router.delete(
  "/:id",
  authorize("tm:tasks:delete"),
  validateParams(objectIdParamSchema),
  remove,
);

export default router;
