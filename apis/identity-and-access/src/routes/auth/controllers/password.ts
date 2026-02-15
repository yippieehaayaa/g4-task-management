import {
  changePassword as changeIdentityPassword,
  revokeAllSessions,
} from "@g4/db-iam";
import { BadRequestError, UnauthorizedError } from "@g4/error-handler";
import type { changePasswordBodySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof changePasswordBodySchema>;

const changePassword = typedHandler<unknown, Body>(async (req, res) => {
  const { currentPassword, newPassword } = res.locals.body;

  if (currentPassword === newPassword) {
    throw new BadRequestError(
      "New password must be different from your current password",
      { code: "NEW_PASSWORD_SAME_AS_CURRENT" },
    );
  }

  try {
    await changeIdentityPassword({
      identityId: req.identity.id,
      currentPassword,
      newPassword,
      ipAddress: req.ip,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid current password") {
        throw new UnauthorizedError("Invalid current password");
      }
      if (error.message === "Password does not meet requirements") {
        throw new BadRequestError("Password does not meet requirements", {
          code: "PASSWORD_REUSED",
        });
      }
    }
    throw error;
  }

  await revokeAllSessions(req.identity.id);

  audit({
    event: "identity.password.changed",
    actorId: req.identity.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
  });

  res.json({ data: { message: "Password changed successfully" } });
});

export { changePassword };
