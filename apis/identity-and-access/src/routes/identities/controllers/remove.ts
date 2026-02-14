import { softDeleteIdentity } from "@g4/db-iam";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

const remove = typedHandler<{ id: string }>(async (req, res) => {
  await softDeleteIdentity(res.locals.params.id);

  audit({
    event: "identity.deleted",
    actorId: req.identity.id,
    targetId: res.locals.params.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
  });

  res.sendStatus(204);
});

export { remove };
