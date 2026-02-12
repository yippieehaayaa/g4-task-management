import { softDeleteIdentity } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const remove = typedHandler<{ id: string }>(async (req, res) => {
  await softDeleteIdentity(req.params.id);
  res.sendStatus(204);
});

export { remove };
