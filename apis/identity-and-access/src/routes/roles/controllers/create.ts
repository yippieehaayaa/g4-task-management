import { createRole, findRoleByName } from "@g4/db-iam";
import { ConflictError } from "@g4/error-handler";
import type { createRoleSchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof createRoleSchema>;

const create = typedHandler<unknown, Body>(async (_req, res) => {
  const existing = await findRoleByName(res.locals.body.name);
  if (existing) throw new ConflictError("Role name already exists");

  const role = await createRole(res.locals.body);
  res.status(201).json({ data: role });
});

export { create };
