import { deactivateIdentity } from "@g4/db-iam";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

const deactivate = typedHandler<{ id: string }>(async (req, res) => {
  await deactivateIdentity(req.params.id);

  audit({
    event: "identity.deactivated",
    actorId: req.identity.id,
    targetId: req.params.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
  });

  res.sendStatus(204);
});

export { deactivate };
