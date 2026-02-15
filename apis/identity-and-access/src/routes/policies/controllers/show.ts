import { findPolicyByIdOrThrow } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (_req, res) => {
  const policy = await findPolicyByIdOrThrow(res.locals.params.id);
  res.json({ data: policy });
});

export { show };
