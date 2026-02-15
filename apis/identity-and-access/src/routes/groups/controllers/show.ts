import { findGroupByIdOrThrow } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (_req, res) => {
  const group = await findGroupByIdOrThrow(res.locals.params.id);
  res.json({ data: group });
});

export { show };
