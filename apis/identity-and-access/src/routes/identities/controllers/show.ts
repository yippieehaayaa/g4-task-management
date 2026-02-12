import { findPublicIdentityById } from "@g4/db-iam";
import { NotFoundError } from "@g4/error-handler";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (req, res) => {
  const identity = await findPublicIdentityById(req.params.id);
  if (!identity) throw new NotFoundError("Identity not found");

  res.json({ data: identity });
});

export { show };
