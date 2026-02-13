import {
  listIdentitiesQuerySchema,
  objectIdParamSchema,
  updateIdentitySchema,
} from "@g4/schemas/iam";
import { validateBody, validateParams, validateQuery } from "@g4/validate";
import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { deactivate } from "./controllers/deactivate";
import { list } from "./controllers/list";
import { remove } from "./controllers/remove";
import { show } from "./controllers/show";
import { update } from "./controllers/update";

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

router.delete(
  "/:id",
  authorize("iam:identities:delete"),
  validateParams(objectIdParamSchema),
  remove,
);

router.post(
  "/:id/deactivate",
  authorize("iam:identities:write"),
  validateParams(objectIdParamSchema),
  deactivate,
);

export default router;
