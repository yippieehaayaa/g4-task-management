import { findPublicIdentityByIdOrThrow } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (_req, res) => {
  const identity = await findPublicIdentityByIdOrThrow(res.locals.params.id);
  res.json({ data: identity });
});

export { show };
