import {
  changePassword as changeIdentityPassword,
  revokeAllSessions,
} from "@g4/db-iam";
import type { changePasswordBodySchema } from "@g4/schemas/iam";
import { typedHandler } from "../../../utils/typedHandler";
import type { z } from "zod";

type Body = z.infer<typeof changePasswordBodySchema>;

const changePassword = typedHandler<unknown, Body>(async (req, res) => {
  await changeIdentityPassword({
    identityId: req.identity.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
    ipAddress: req.ip,
  });

  await revokeAllSessions(req.identity.id);

  res.json({ data: { message: "Password changed successfully" } });
});

export { changePassword };
