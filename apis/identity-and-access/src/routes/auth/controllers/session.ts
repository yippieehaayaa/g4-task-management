import { listSessionsByIdentity, revokeSessionById } from "@g4/db-iam";
import { NotFoundError } from "@g4/error-handler";
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

  res.sendStatus(204);
});

export { listSessions, revokeSession };
