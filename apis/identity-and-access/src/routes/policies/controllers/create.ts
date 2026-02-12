import { createPolicy, findPolicyByName } from "@g4/db-iam";
import { ConflictError } from "@g4/error-handler";
import type { createPolicySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof createPolicySchema>;

const create = typedHandler<unknown, Body>(async (req, res) => {
  const existing = await findPolicyByName(req.body.name);
  if (existing) throw new ConflictError("Policy name already exists");

  const policy = await createPolicy(req.body);
  res.status(201).json({ data: policy });
});

export { create };
