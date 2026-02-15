import {
  changePassword as changeIdentityPassword,
  revokeAllSessions,
} from "@g4/db-iam";
import type { changePasswordBodySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof changePasswordBodySchema>;

const changePassword = typedHandler<unknown, Body>(async (req, res) => {
  const { currentPassword, newPassword } = res.locals.body;

  await changeIdentityPassword({
    identityId: req.identity.id,
    currentPassword,
    newPassword,
    ipAddress: req.ip,
  });

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
