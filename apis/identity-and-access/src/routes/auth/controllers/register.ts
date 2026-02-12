import { createIdentity, findIdentityByUsername } from "@g4/db-iam";
import { ConflictError } from "@g4/error-handler";
import type { createIdentitySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof createIdentitySchema>;

const register = typedHandler<unknown, Body>(async (req, res) => {
  const existing = await findIdentityByUsername(req.body.username);
  if (existing) throw new ConflictError("Username already exists");

  const identity = await createIdentity(req.body);
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
