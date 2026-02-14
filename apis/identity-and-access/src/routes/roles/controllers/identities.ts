import { assignRoleToIdentity, removeRoleFromIdentity } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

type Body = { identityId: string };

const assignIdentity = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const identity = await assignRoleToIdentity(
    res.locals.body.identityId,
    res.locals.params.id,
  );
  res.json({ data: identity });
});

const removeIdentity = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const identity = await removeRoleFromIdentity(
    res.locals.body.identityId,
    res.locals.params.id,
  );
  res.json({ data: identity });
});

export { assignIdentity, removeIdentity };
