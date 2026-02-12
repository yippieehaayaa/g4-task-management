import { createIdentity, findIdentityByUsername } from "@g4/db-iam";
import { ConflictError } from "@g4/error-handler";
import type { createIdentitySchema } from "@g4/schemas/iam";
import { typedHandler } from "../../../utils/typedHandler";
import type { z } from "zod";

type Body = z.infer<typeof createIdentitySchema>;

const register = typedHandler<unknown, Body>(async (req, res) => {
  const existing = await findIdentityByUsername(req.body.username);
  if (existing) throw new ConflictError("Username already exists");

  const identity = await createIdentity(req.body);
  const { hash, salt, ...data } = identity;

  res.status(201).json({ data });
});

export { register };
