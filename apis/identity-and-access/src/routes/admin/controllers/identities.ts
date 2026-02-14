import { unlockIdentity } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const unlock = typedHandler<{ identityId: string }>(async (_req, res) => {
  await unlockIdentity(res.locals.params.identityId);
  res.json({ data: { message: "Identity unlocked" } });
});

export { unlock };
