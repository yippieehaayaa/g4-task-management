import { validateBody, validateParams, validateQuery } from "@g4/validate";
import {
  createGroupSchema,
  updateGroupSchema,
  addIdentitiesToGroupSchema,
  removeIdentitiesFromGroupSchema,
  addRolesToGroupSchema,
  removeRolesFromGroupSchema,
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
import { addIdentities, removeIdentities } from "./controllers/identities";
import { addRoles, removeRoles } from "./controllers/roles";

const router = Router();

router.get(
  "/",
  authorize("iam:groups:read"),
  validateQuery(paginationQuerySchema),
  list,
);

router.post(
  "/",
  authorize("iam:groups:write"),
  validateBody(createGroupSchema),
  create,
);

router.get(
  "/:id",
  authorize("iam:groups:read"),
  validateParams(objectIdParamSchema),
  show,
);

router.patch(
  "/:id",
  authorize("iam:groups:write"),
  validateParams(objectIdParamSchema),
  validateBody(updateGroupSchema),
  update,
);

router.delete(
  "/:id",
  authorize("iam:groups:delete"),
  validateParams(objectIdParamSchema),
  remove,
);

router.post(
  "/:id/identities",
  authorize("iam:groups:write"),
  validateParams(objectIdParamSchema),
  validateBody(addIdentitiesToGroupSchema.omit({ groupId: true })),
  addIdentities,
);

router.delete(
  "/:id/identities",
  authorize("iam:groups:write"),
  validateParams(objectIdParamSchema),
  validateBody(removeIdentitiesFromGroupSchema.omit({ groupId: true })),
  removeIdentities,
);

router.post(
  "/:id/roles",
  authorize("iam:groups:write"),
  validateParams(objectIdParamSchema),
  validateBody(addRolesToGroupSchema.omit({ groupId: true })),
  addRoles,
);

router.delete(
  "/:id/roles",
  authorize("iam:groups:write"),
  validateParams(objectIdParamSchema),
  validateBody(removeRolesFromGroupSchema.omit({ groupId: true })),
  removeRoles,
);

export default router;
