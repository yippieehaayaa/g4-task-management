import { listOtpsByIdentity } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const listOtps = typedHandler<{ identityId: string }>(async (_req, res) => {
  const otps = await listOtpsByIdentity(res.locals.params.identityId);
  res.json({ data: otps });
});

const expireOtps = typedHandler<{ identityId: string }>(async (_req, res) => {
  res.json({ data: { message: "OTPs expired" } });
});

export { listOtps, expireOtps };
