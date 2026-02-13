import { unlockIdentity } from "@g4/db-iam";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

const unlock = typedHandler<{ identityId: string }>(async (req, res) => {
  await unlockIdentity(req.params.identityId);

  audit({
    event: "identity.unlocked",
    actorId: req.identity.id,
    targetId: req.params.identityId,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
  });

  res.sendStatus(204);
});

export { unlock };
