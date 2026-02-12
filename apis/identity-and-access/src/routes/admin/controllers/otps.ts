import { expireOtpsByIdentity, listOtpsByIdentity } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

const listOtps = typedHandler<{ identityId: string }>(async (req, res) => {
  const otps = await listOtpsByIdentity(req.params.identityId);
  res.json({ data: otps });
});

const expireOtps = typedHandler<{ identityId: string }>(async (req, res) => {
  await expireOtpsByIdentity(req.params.identityId);
  res.sendStatus(204);
});

export { listOtps, expireOtps };
