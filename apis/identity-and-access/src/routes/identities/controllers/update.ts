import { updateIdentity } from "@g4/db-iam";
import type { updateIdentitySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof updateIdentitySchema>;

const update = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const identity = await updateIdentity(res.locals.params.id, res.locals.body);
  res.json({ data: identity });
});

export { update };
