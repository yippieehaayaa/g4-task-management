import { createAuditLogger } from "@g4/logger";

const log = createAuditLogger({ service: "identity-and-access" });

type AuditEvent =
  | "identity.registered"
  | "identity.login"
  | "identity.login.failed"
  | "identity.logout"
  | "identity.password.changed"
  | "identity.email.changed"
  | "identity.deactivated"
  | "identity.deleted"
  | "session.revoked"
  | "session.revoked.all"
  | "otp.expired.all";

type AuditPayload = {
  event: AuditEvent;
  actorId?: string;
  targetId?: string;
  ip?: string;
  requestId?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
};

const audit = ({ event, ...data }: AuditPayload) => {
  log.info(data, event);
};

export { audit, type AuditEvent };
