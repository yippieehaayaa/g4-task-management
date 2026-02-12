import { changeEmail as changeIdentityEmail } from "@g4/db-iam";
import type { changeEmailBodySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof changeEmailBodySchema>;

const changeEmail = typedHandler<unknown, Body>(async (req, res) => {
  await changeIdentityEmail({
    identityId: req.identity.id,
    newEmail: req.body.newEmail,
    ipAddress: req.ip,
  });

  audit({
    event: "identity.email.changed",
    actorId: req.identity.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
    metadata: { newEmail: req.body.newEmail },
  });

  res.json({ data: { message: "Email changed successfully" } });
});

export { changeEmail };
