import { softDeleteRole } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const remove = typedHandler<{ id: string }>(async (req, res) => {
  await softDeleteRole(req.params.id);
  res.sendStatus(204);
});

export { remove };
