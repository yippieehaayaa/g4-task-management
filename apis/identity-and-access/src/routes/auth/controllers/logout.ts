import { revokeSession as revokeSessionByToken } from "@g4/db-iam";
import type { refreshTokenBodySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof refreshTokenBodySchema>;

const logout = typedHandler<unknown, Body>(async (req, res) => {
  await revokeSessionByToken(res.locals.body.refreshToken, req.identity.id);

  audit({
    event: "identity.logout",
    actorId: req.identity.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
  });

  res.sendStatus(204);
});

export { logout };
