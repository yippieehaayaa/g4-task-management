import { env } from "../config";

interface ServiceConfig {
  /** Unique service identifier */
  name: string;
  /** URL path prefix that routes to this service (e.g. "/iam") */
  pathPrefix: string;
  /** Upstream service base URL */
  target: string;
  /** Request timeout in milliseconds */
  timeout: number;
}

/**
 * Service registry — central configuration for all downstream services.
 *
 * Path mapping:
 *   /iam/**  →  identity-and-access  (auth, identities, roles, policies, groups, admin)
 *   /tm/**   →  task-management      (tasks)
 *
 * The gateway strips the path prefix before forwarding:
 *   GET /iam/auth/login   →  GET http://localhost:3000/auth/login
 *   GET /tm/tasks         →  GET http://localhost:3001/tasks
 */
const createServiceRegistry = (): ServiceConfig[] => [
  {
    name: "identity-and-access",
    pathPrefix: "/iam",
    target: env.IAM_SERVICE_URL,
    timeout: env.PROXY_TIMEOUT_MS,
  },
  {
    name: "task-management",
    pathPrefix: "/tm",
    target: env.TM_SERVICE_URL,
    timeout: env.PROXY_TIMEOUT_MS,
  },
];

let registry: ServiceConfig[] | null = null;

const getServiceRegistry = (): ServiceConfig[] => {
  if (!registry) {
    registry = createServiceRegistry();
  }
  return registry;
};

export { getServiceRegistry, type ServiceConfig };
