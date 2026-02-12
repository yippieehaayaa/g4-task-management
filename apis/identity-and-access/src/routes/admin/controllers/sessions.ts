import {
  listSessionsByIdentity,
  revokeAllSessions as revokeAll,
  revokeSessionById,
} from "@g4/db-iam";
import { NotFoundError } from "@g4/error-handler";
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

    res.sendStatus(204);
  },
);

const revokeAllSessions = typedHandler<{ identityId: string }>(
  async (req, res) => {
    await revokeAll(req.params.identityId);
    res.sendStatus(204);
  },
);

export { listSessions, revokeSession, revokeAllSessions };
