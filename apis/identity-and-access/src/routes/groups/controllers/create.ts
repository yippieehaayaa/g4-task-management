import { createGroup, findGroupByName } from "@g4/db-iam";
import { ConflictError } from "@g4/error-handler";
import type { createGroupSchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof createGroupSchema>;

const create = typedHandler<unknown, Body>(async (req, res) => {
  const existing = await findGroupByName(req.body.name);
  if (existing) throw new ConflictError("Group name already exists");

  const group = await createGroup(req.body);
  res.status(201).json({ data: group });
});

export { create };
