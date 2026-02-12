import { listSessionsByIdentity, revokeSessionById } from "@g4/db-iam";
import { NotFoundError } from "@g4/error-handler";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

const listSessions = typedHandler(async (req, res) => {
  const sessions = await listSessionsByIdentity(req.identity.id);
  res.json({ data: sessions });
});

const revokeSession = typedHandler<{ sessionId: string }>(async (req, res) => {
  try {
    await revokeSessionById(req.params.sessionId, req.identity.id);
  } catch {
    throw new NotFoundError("Session not found");
  }

  audit({
    event: "session.revoked",
    actorId: req.identity.id,
    targetId: req.identity.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
    metadata: { sessionId: req.params.sessionId },
  });

  res.sendStatus(204);
});

export { listSessions, revokeSession };
