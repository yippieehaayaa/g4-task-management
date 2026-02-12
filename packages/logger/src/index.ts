import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(process.env.NODE_ENV === "development" && {
    transport: { target: "pino-pretty" },
  }),
});

const auditLogger = pino({
  level: "info",
  ...(process.env.NODE_ENV === "development" && {
    transport: { target: "pino-pretty" },
  }),
});

const createLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};

const createAuditLogger = (context: Record<string, unknown>) => {
  return auditLogger.child({ ...context, stream: "audit" });
};

export { logger, auditLogger, createLogger, createAuditLogger };
