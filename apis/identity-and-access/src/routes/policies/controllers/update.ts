import { updatePolicy } from "@g4/db-iam";
import type { updatePolicySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof updatePolicySchema>;

const update = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const policy = await updatePolicy(res.locals.params.id, res.locals.body);
  res.json({ data: policy });
});

export { update };
