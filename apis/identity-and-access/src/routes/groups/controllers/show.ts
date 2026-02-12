import { findGroupById } from "@g4/db-iam";
import { NotFoundError } from "@g4/error-handler";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (req, res) => {
  const group = await findGroupById(req.params.id);
  if (!group) throw new NotFoundError("Group not found");

  res.json({ data: group });
});

export { show };
