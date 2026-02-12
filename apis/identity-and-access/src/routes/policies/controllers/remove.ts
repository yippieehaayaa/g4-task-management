import { softDeletePolicy } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const remove = typedHandler<{ id: string }>(async (req, res) => {
  await softDeletePolicy(req.params.id);
  res.sendStatus(204);
});

export { remove };
