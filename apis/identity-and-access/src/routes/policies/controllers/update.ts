import { updatePolicy } from "@g4/db-iam";
import type { updatePolicySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof updatePolicySchema>;

const update = typedHandler<{ id: string }, Body>(async (req, res) => {
  const policy = await updatePolicy(req.params.id, req.body);
  res.json({ data: policy });
});

export { update };
