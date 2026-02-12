import { validateBody, validateParams, validateQuery } from "@g4/validate";
import {
  listIdentitiesQuerySchema,
  objectIdParamSchema,
  updateIdentitySchema,
} from "@g4/schemas/iam";
import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { list } from "./controllers/list";
import { show } from "./controllers/show";
import { update } from "./controllers/update";
import { deactivate } from "./controllers/deactivate";
import { remove } from "./controllers/remove";

const router = Router();

router.get(
  "/",
  authorize("iam:identities:read"),
  validateQuery(listIdentitiesQuerySchema),
  list,
);

router.get(
  "/:id",
  authorize("iam:identities:read"),
  validateParams(objectIdParamSchema),
  show,
);

router.patch(
  "/:id",
  authorize("iam:identities:write"),
  validateParams(objectIdParamSchema),
  validateBody(updateIdentitySchema),
  update,
);

router.post(
  "/:id/deactivate",
  authorize("iam:identities:write"),
  validateParams(objectIdParamSchema),
  deactivate,
);

router.delete(
  "/:id",
  authorize("iam:identities:delete"),
  validateParams(objectIdParamSchema),
  remove,
);

export default router;
