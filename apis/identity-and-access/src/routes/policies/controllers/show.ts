import { findPolicyById } from "@g4/db-iam";
import { NotFoundError } from "@g4/error-handler";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (_req, res) => {
  const policy = await findPolicyById(res.locals.params.id);
  if (!policy) throw new NotFoundError("Policy not found");

  res.json({ data: policy });
});

export { show };
