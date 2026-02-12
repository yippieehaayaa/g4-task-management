import { changeEmail as changeIdentityEmail } from "@g4/db-iam";
import type { changeEmailBodySchema } from "@g4/schemas/iam";
import { typedHandler } from "../../../utils/typedHandler";
import type { z } from "zod";

type Body = z.infer<typeof changeEmailBodySchema>;

const changeEmail = typedHandler<unknown, Body>(async (req, res) => {
  await changeIdentityEmail({
    identityId: req.identity.id,
    newEmail: req.body.newEmail,
    ipAddress: req.ip,
  });

  res.json({ data: { message: "Email changed successfully" } });
});

export { changeEmail };
