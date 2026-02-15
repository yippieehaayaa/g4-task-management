import { findRoleByIdOrThrow } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (_req, res) => {
  const role = await findRoleByIdOrThrow(res.locals.params.id);
  res.json({ data: role });
});

export { show };
