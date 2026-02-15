import {
  listSessionsByIdentity,
  revokeAllSessions as revokeAll,
  revokeSessionById,
} from "@g4/db-iam";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

const listSessions = typedHandler<{ identityId: string }>(async (_req, res) => {
  const sessions = await listSessionsByIdentity(res.locals.params.identityId);
  res.json({ data: sessions });
});

const revokeSession = typedHandler<{ identityId: string; sessionId: string }>(
  async (req, res) => {
    await revokeSessionById(
      res.locals.params.sessionId,
      res.locals.params.identityId,
    );

    audit({
      event: "session.revoked",
      actorId: req.identity.id,
      targetId: res.locals.params.identityId,
      ip: req.ip,
      requestId: req.id,
      userAgent: req.headers["user-agent"],
      metadata: { sessionId: res.locals.params.sessionId },
    });

    res.sendStatus(204);
  },
);

const revokeAllSessions = typedHandler<{ identityId: string }>(
  async (req, res) => {
    await revokeAll(res.locals.params.identityId);

    audit({
      event: "session.revoked.all",
      actorId: req.identity.id,
      targetId: res.locals.params.identityId,
      ip: req.ip,
      requestId: req.id,
      userAgent: req.headers["user-agent"],
    });

    res.sendStatus(204);
  },
);

export { listSessions, revokeSession, revokeAllSessions };
