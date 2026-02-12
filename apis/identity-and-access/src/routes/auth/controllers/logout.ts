import { revokeSession as revokeSessionByToken } from "@g4/db-iam";
import type { refreshTokenBodySchema } from "@g4/schemas/iam";
import { typedHandler } from "../../../utils/typedHandler";
import type { z } from "zod";

type Body = z.infer<typeof refreshTokenBodySchema>;

const logout = typedHandler<unknown, Body>(async (req, res) => {
  await revokeSessionByToken(req.body.refreshToken, req.identity.id);
  res.sendStatus(204);
});

export { logout };
