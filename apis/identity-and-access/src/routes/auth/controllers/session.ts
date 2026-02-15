import { listSessionsByIdentity, revokeSessionById } from "@g4/db-iam";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

const listSessions = typedHandler(async (req, res) => {
  const sessions = await listSessionsByIdentity(req.identity.id);
  res.json({ data: sessions });
});

const revokeSession = typedHandler<{ sessionId: string }>(async (req, res) => {
  await revokeSessionById(res.locals.params.sessionId, req.identity.id);

  audit({
    event: "session.revoked",
    actorId: req.identity.id,
    targetId: req.identity.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
    metadata: { sessionId: res.locals.params.sessionId },
  });

  res.sendStatus(204);
});

export { listSessions, revokeSession };
