import { updateRole } from "@g4/db-iam";
import type { updateRoleSchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof updateRoleSchema>;

const update = typedHandler<{ id: string }, Body>(async (req, res) => {
  const role = await updateRole(req.params.id, req.body);
  res.json({ data: role });
});

export { update };
