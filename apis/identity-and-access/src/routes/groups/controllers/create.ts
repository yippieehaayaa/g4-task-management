import { createPolicy, findPolicyByName } from "@g4/db-iam";
import { ConflictError } from "@g4/error-handler";
import type { createPolicySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof createPolicySchema>;

const create = typedHandler<unknown, Body>(async (_req, res) => {
  const existing = await findPolicyByName(res.locals.body.name);
  if (existing) throw new ConflictError("Policy name already exists");

  const policy = await createPolicy(res.locals.body);
  res.status(201).json({ data: policy });
});

export { create };
