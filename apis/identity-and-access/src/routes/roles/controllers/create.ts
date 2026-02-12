import { createRole, findRoleByName } from "@g4/db-iam";
import { ConflictError } from "@g4/error-handler";
import type { createRoleSchema } from "@g4/schemas/iam";
import { typedHandler } from "../../../utils/typedHandler";
import type { z } from "zod";

type Body = z.infer<typeof createRoleSchema>;

const create = typedHandler<unknown, Body>(async (req, res) => {
  const existing = await findRoleByName(req.body.name);
  if (existing) throw new ConflictError("Role name already exists");

  const role = await createRole(req.body);
  res.status(201).json({ data: role });
});

export { create };
