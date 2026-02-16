import { findPublicIdentityByIdOrThrow } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

/**
 * GET /account/identity — return the current authenticated user.
 * Requires Bearer token. Used by the app for auth context (e.g. getAccountIdentity).
 */
const getIdentity = typedHandler(async (req, res) => {
  const identity = await findPublicIdentityByIdOrThrow(req.identity.id);
  res.json({ data: identity });
});

export { getIdentity };
