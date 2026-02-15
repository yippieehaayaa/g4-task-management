import { createIdentity } from "@g4/db-iam";
import type { createIdentitySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof createIdentitySchema>;

const register = typedHandler<unknown, Body>(async (req, res) => {
  const identity = await createIdentity(res.locals.body);
  const { hash, salt, ...data } = identity;

  audit({
    event: "identity.registered",
    targetId: identity.id,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
  });

  res.status(201).json({ data });
});

export { register };
