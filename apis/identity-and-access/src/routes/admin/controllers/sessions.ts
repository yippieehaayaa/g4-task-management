import {
  listSessionsByIdentity,
  revokeAllSessions as revokeAll,
  revokeSessionById,
} from "@g4/db-iam";
import { NotFoundError } from "@g4/error-handler";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

const listSessions = typedHandler<{ identityId: string }>(async (req, res) => {
  const sessions = await listSessionsByIdentity(req.params.identityId);
  res.json({ data: sessions });
});

const revokeSession = typedHandler<{ identityId: string; sessionId: string }>(
  async (req, res) => {
    try {
      await revokeSessionById(req.params.sessionId, req.params.identityId);
    } catch {
      throw new NotFoundError("Session not found");
    }

    audit({
      event: "session.revoked",
      actorId: req.identity.id,
      targetId: req.params.identityId,
      ip: req.ip,
      requestId: req.id,
      userAgent: req.headers["user-agent"],
      metadata: { sessionId: req.params.sessionId },
    });

    res.sendStatus(204);
  },
);

const revokeAllSessions = typedHandler<{ identityId: string }>(
  async (req, res) => {
    await revokeAll(req.params.identityId);

    audit({
      event: "session.revoked.all",
      actorId: req.identity.id,
      targetId: req.params.identityId,
      ip: req.ip,
      requestId: req.id,
      userAgent: req.headers["user-agent"],
    });

    res.sendStatus(204);
  },
);

export { listSessions, revokeSession, revokeAllSessions };
