import { createGroup, findGroupByName } from "@g4/db-iam";
import { ConflictError } from "@g4/error-handler";
import type { createGroupSchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof createGroupSchema>;

const create = typedHandler<unknown, Body>(async (_req, res) => {
  const existing = await findGroupByName(res.locals.body.name);
  if (existing) throw new ConflictError("Group name already exists");

  const group = await createGroup(res.locals.body);
  res.status(201).json({ data: group });
});

export { create };
