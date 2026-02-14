import { findRoleById } from "@g4/db-iam";
import { NotFoundError } from "@g4/error-handler";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (_req, res) => {
  const role = await findRoleById(res.locals.params.id);
  if (!role) throw new NotFoundError("Role not found");

  res.json({ data: role });
});

export { show };
