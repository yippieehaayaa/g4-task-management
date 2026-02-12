import { validateBody, validateParams, validateQuery } from "@g4/validate";
import {
  createRoleSchema,
  updateRoleSchema,
  addPoliciesToRoleSchema,
  removePoliciesFromRoleSchema,
  assignRoleToIdentitySchema,
  removeRoleFromIdentitySchema,
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
import { addPolicies, removePolicies } from "./controllers/policies";
import { assignIdentity, removeIdentity } from "./controllers/identities";

const router = Router();

router.get(
  "/",
  authorize("iam:roles:read"),
  validateQuery(paginationQuerySchema),
  list,
);

router.post(
  "/",
  authorize("iam:roles:write"),
  validateBody(createRoleSchema),
  create,
);

router.get(
  "/:id",
  authorize("iam:roles:read"),
  validateParams(objectIdParamSchema),
  show,
);

router.patch(
  "/:id",
  authorize("iam:roles:write"),
  validateParams(objectIdParamSchema),
  validateBody(updateRoleSchema),
  update,
);

router.delete(
  "/:id",
  authorize("iam:roles:delete"),
  validateParams(objectIdParamSchema),
  remove,
);

router.post(
  "/:id/policies",
  authorize("iam:roles:write"),
  validateParams(objectIdParamSchema),
  validateBody(addPoliciesToRoleSchema.omit({ roleId: true })),
  addPolicies,
);

router.delete(
  "/:id/policies",
  authorize("iam:roles:write"),
  validateParams(objectIdParamSchema),
  validateBody(removePoliciesFromRoleSchema.omit({ roleId: true })),
  removePolicies,
);

router.post(
  "/:id/identities",
  authorize("iam:roles:write"),
  validateParams(objectIdParamSchema),
  validateBody(assignRoleToIdentitySchema.omit({ roleId: true })),
  assignIdentity,
);

router.delete(
  "/:id/identities",
  authorize("iam:roles:write"),
  validateParams(objectIdParamSchema),
  validateBody(removeRoleFromIdentitySchema.omit({ roleId: true })),
  removeIdentity,
);

export default router;
