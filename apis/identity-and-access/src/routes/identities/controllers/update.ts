import { updateIdentity } from "@g4/db-iam";
import type { updateIdentitySchema } from "@g4/schemas/iam";
import { typedHandler } from "../../../utils/typedHandler";
import type { z } from "zod";

type Body = z.infer<typeof updateIdentitySchema>;

const update = typedHandler<{ id: string }, Body>(async (req, res) => {
  const identity = await updateIdentity(req.params.id, req.body);
  res.json({ data: identity });
});

export { update };
