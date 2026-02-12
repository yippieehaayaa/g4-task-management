import { updatePolicy } from "@g4/db-iam";
import type { updatePolicySchema } from "@g4/schemas/iam";
import { typedHandler } from "../../../utils/typedHandler";
import type { z } from "zod";

type Body = z.infer<typeof updatePolicySchema>;

const update = typedHandler<{ id: string }, Body>(async (req, res) => {
  const policy = await updatePolicy(req.params.id, req.body);
  res.json({ data: policy });
});

export { update };
