import { assignRoleToIdentity, removeRoleFromIdentity } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

type Body = { identityId: string };

const assignIdentity = typedHandler<{ id: string }, Body>(async (req, res) => {
  const identity = await assignRoleToIdentity(
    req.body.identityId,
    req.params.id,
  );
  res.json({ data: identity });
});

const removeIdentity = typedHandler<{ id: string }, Body>(async (req, res) => {
  const identity = await removeRoleFromIdentity(
    req.body.identityId,
    req.params.id,
  );
  res.json({ data: identity });
});

export { assignIdentity, removeIdentity };
