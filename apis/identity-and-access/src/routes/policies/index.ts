import { validateBody, validateParams, validateQuery } from "@g4/validate";
import {
  createPolicySchema,
  updatePolicySchema,
  objectIdParamSchema,
  paginationQuerySchema,
} from "@g4/schemas/iam";
import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { list } from "./controllers/list";
import { create } from "./controllers/create";
import { show } from "./controllers/show";
import { update } from "./controllers/update";
import { remove } from "./controllers/remove";

const router = Router();

router.get(
  "/",
  authorize("iam:policies:read"),
  validateQuery(paginationQuerySchema),
  list,
);

router.post(
  "/",
  authorize("iam:policies:write"),
  validateBody(createPolicySchema),
  create,
);

router.get(
  "/:id",
  authorize("iam:policies:read"),
  validateParams(objectIdParamSchema),
  show,
);

router.patch(
  "/:id",
  authorize("iam:policies:write"),
  validateParams(objectIdParamSchema),
  validateBody(updatePolicySchema),
  update,
);

router.delete(
  "/:id",
  authorize("iam:policies:delete"),
  validateParams(objectIdParamSchema),
  remove,
);

export default router;
