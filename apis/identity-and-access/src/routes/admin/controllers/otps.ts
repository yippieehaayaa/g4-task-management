import { expireOtpsByIdentity, listOtpsByIdentity } from "@g4/db-iam";
import { audit } from "../../../utils/audit";
import { typedHandler } from "../../../utils/typedHandler";

const listOtps = typedHandler<{ identityId: string }>(async (req, res) => {
  const otps = await listOtpsByIdentity(req.params.identityId);
  res.json({ data: otps });
});

const expireOtps = typedHandler<{ identityId: string }>(async (req, res) => {
  await expireOtpsByIdentity(req.params.identityId);

  audit({
    event: "otp.expired.all",
    actorId: req.identity.id,
    targetId: req.params.identityId,
    ip: req.ip,
    requestId: req.id,
    userAgent: req.headers["user-agent"],
  });

  res.sendStatus(204);
});

export { listOtps, expireOtps };
