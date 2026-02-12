import { validateBody, validateParams } from "@g4/validate";
import {
  createIdentitySchema,
  loginSchema,
  refreshTokenBodySchema,
  changePasswordBodySchema,
  changeEmailBodySchema,
} from "@g4/schemas/iam";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../../middlewares/authenticate";
import { authRateLimiter } from "../../middlewares/rateLimiter";
import { register } from "./controllers/register";
import { login } from "./controllers/login";
import { refresh } from "./controllers/refresh";
import { logout } from "./controllers/logout";
import { changePassword } from "./controllers/password";
import { changeEmail } from "./controllers/email";
import { listSessions, revokeSession } from "./controllers/session";

const router = Router();

const sessionIdParamSchema = z.object({
  sessionId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid session ID"),
});

router.post(
  "/register",
  authRateLimiter,
  validateBody(createIdentitySchema),
  register,
);

router.post("/login", authRateLimiter, validateBody(loginSchema), login);

router.post("/refresh", validateBody(refreshTokenBodySchema), refresh);

router.post(
  "/logout",
  authenticate,
  validateBody(refreshTokenBodySchema),
  logout,
);

router.patch(
  "/password",
  authenticate,
  validateBody(changePasswordBodySchema),
  changePassword,
);

router.patch(
  "/email",
  authenticate,
  validateBody(changeEmailBodySchema),
  changeEmail,
);

router.get("/sessions", authenticate, listSessions);

router.delete(
  "/sessions/:sessionId",
  authenticate,
  validateParams(sessionIdParamSchema),
  revokeSession,
);

export default router;
