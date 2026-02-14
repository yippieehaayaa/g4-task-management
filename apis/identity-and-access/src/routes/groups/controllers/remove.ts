import { softDeletePolicy } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const remove = typedHandler<{ id: string }>(async (_req, res) => {
  await softDeletePolicy(res.locals.params.id);
  res.sendStatus(204);
});

export { remove };
