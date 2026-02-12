import {
  createPolicySchema,
  objectIdParamSchema,
  paginationQuerySchema,
  updatePolicySchema,
} from "@g4/schemas/iam";
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
