import { validateParams } from "@g4/validate";
import { Router } from "express";
import { z } from "zod";
import { authorize } from "../../middlewares/authorize";
import { expireOtps, listOtps } from "./controllers/otps";
import {
  listSessions,
  revokeAllSessions,
  revokeSession,
} from "./controllers/sessions";

const router = Router();

const identityIdParamSchema = z.object({
  identityId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid identity ID"),
});

const sessionParamsSchema = z.object({
  identityId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid identity ID"),
  sessionId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid session ID"),
});

router.get(
  "/identities/:identityId/sessions",
  authorize("iam:sessions:read"),
  validateParams(identityIdParamSchema),
  listSessions,
);

router.delete(
  "/identities/:identityId/sessions/:sessionId",
  authorize("iam:sessions:write"),
  validateParams(sessionParamsSchema),
  revokeSession,
);

router.delete(
  "/identities/:identityId/sessions",
  authorize("iam:sessions:write"),
  validateParams(identityIdParamSchema),
  revokeAllSessions,
);

router.get(
  "/identities/:identityId/otps",
  authorize("iam:otps:read"),
  validateParams(identityIdParamSchema),
  listOtps,
);

router.post(
  "/identities/:identityId/otps/expire",
  authorize("iam:otps:write"),
  validateParams(identityIdParamSchema),
  expireOtps,
);

export default router;
