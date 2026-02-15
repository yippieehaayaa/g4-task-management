import { Router } from "express";
import { createServiceProxy } from "../proxy/createServiceProxy";
import { getServiceRegistry } from "../proxy/registry";
import main from "./main";

const router = Router();

// Gateway-specific routes (health, readiness)
router.use("/", main);

/**
 * Mount reverse proxies for each registered service.
 *
 * Routing:
 *   /iam/**  →  identity-and-access service
 *   /tm/**   →  task-management service
 *
 * Each proxy includes:
 *   - Circuit breaker (503 when upstream is unhealthy)
 *   - Request ID propagation
 *   - Path prefix stripping
 *   - Configurable timeout
 */
for (const service of getServiceRegistry()) {
  router.use(service.pathPrefix, createServiceProxy(service));
}

export default router;
