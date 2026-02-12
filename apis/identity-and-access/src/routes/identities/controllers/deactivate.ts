import { deactivateIdentity } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const deactivate = typedHandler<{ id: string }>(async (req, res) => {
  await deactivateIdentity(req.params.id);
  res.sendStatus(204);
});

export { deactivate };
