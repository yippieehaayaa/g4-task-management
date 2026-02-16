# API Gateway

Central HTTP gateway for the G4 task-management platform. It exposes a single entry point, handles cross-cutting concerns (rate limiting, security headers, request IDs), and reverse-proxies requests to downstream services (Identity and Access, Task Management).

---

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 18 (see repo root `package.json` engines)
- **npm** (workspace uses npm workspaces)
- Downstream services running (or URLs pointing to them):
  - **Identity and Access** (default: `http://localhost:3000`)
  - **Task Management** (default: `http://localhost:3001`)

### From repository root (recommended)

The API Gateway is part of a monorepo. Install and run from the **repository root**:

```bash
# From repo root: /g4-task-management
npm install
npm run build
```

Run the gateway in development (with other APIs as needed):

```bash
# From repo root
npm run dev
```

Or run only the api-gateway (from repo root):

```bash
npx turbo run dev --filter=@g4/api-gateway
```

From within the api-gateway directory (after root install):

```bash
cd apis/api-gateway
npm run dev
```

### Environment variables

Copy the sample env and adjust as needed:

```bash
cp .env.sample .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `PORT` | Port the gateway listens on | `4000` |
| `IAM_SERVICE_URL` | Identity and Access service base URL | `http://localhost:3000` |
| `TM_SERVICE_URL` | Task Management service base URL | `http://localhost:3001` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `60000` |
| `RATE_LIMIT_MAX` | Max requests per window | `200` |
| `CB_FAILURE_THRESHOLD` | Circuit breaker: failures before open | `5` |
| `CB_RESET_TIMEOUT_MS` | Circuit breaker: time before half-open (ms) | `30000` |
| `CB_HALF_OPEN_MAX` | Circuit breaker: successes in half-open to close | `3` |
| `PROXY_TIMEOUT_MS` | Upstream request timeout (ms) | `30000` |

### Docker

Build the image from the **repository root** (context must include workspace and shared packages):

```bash
# From repo root
docker build -f apis/api-gateway/Dockerfile .
```

Run (override env as needed):

```bash
docker run -p 4000:4000 \
  -e IAM_SERVICE_URL=http://host.docker.internal:3000 \
  -e TM_SERVICE_URL=http://host.docker.internal:3001 \
  <image-id>
```

The container exposes port **4000** and runs `node apis/api-gateway/dist/index.js`.

---

## API Documentation

### Gateway-owned routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | **Liveness probe.** Returns `200` and `{ "status": "ok" }` if the gateway process is running. |
| `GET` | `/readiness` | **Readiness probe.** Checks all downstream services (HTTP GET to each service’s `/health`). Returns `200` when all are healthy, `503` when any is unhealthy. Response body includes per-service status and circuit breaker state. |

Example readiness response (all healthy):

```json
{
  "status": "ok",
  "services": [
    { "name": "identity-and-access", "status": "healthy", "circuitBreaker": "CLOSED" },
    { "name": "task-management", "status": "healthy", "circuitBreaker": "CLOSED" }
  ]
}
```

### Proxied routes (path prefix → service)

The gateway strips the path prefix and forwards the rest to the corresponding service.

| Path prefix | Downstream service | Example |
|-------------|--------------------|---------|
| `/iam` | Identity and Access | `GET /iam/auth/login` → `GET {IAM_SERVICE_URL}/auth/login` |
| `/tm` | Task Management | `GET /tm/tasks` → `GET {TM_SERVICE_URL}/tasks` |

- **Methods:** All HTTP methods are proxied (e.g. GET, POST, PATCH, DELETE).
- **Headers:** `Content-Type` and `Authorization` are allowed (CORS). `X-Request-ID` is forwarded when present for tracing.
- **Body:** Request bodies are streamed as-is; the gateway does not parse or modify them. Each downstream service is responsible for parsing the body.

For full API contracts (request/response schemas, auth, etc.), see the documentation for each service:

- **Identity and Access:** `apis/identity-and-access`
- **Task Management:** `apis/task-management`

### Errors

| HTTP | Condition |
|------|-----------|
| `502 Bad Gateway` | Proxy could not reach the downstream service (e.g. connection refused, timeout). Response body includes `service` and a short message. |
| `503 Service Unavailable` | Circuit breaker is open for that service, or readiness reports degraded (readiness endpoint only). |
| `429 Too Many Requests` | Rate limit exceeded. Response includes `Retry-After` (draft-7 standard headers). |

---

## Assumptions and Decisions

### No body parsing at the gateway

The gateway does **not** use `express.json()` or any body parser. Request bodies are streamed unchanged to the backend. This avoids extra latency, higher memory use, and content-length/serialization issues when re-sending the body. Body parsing is the responsibility of each downstream service.

### Path prefix stripping

Each service is mounted under a fixed prefix (`/iam`, `/tm`). The prefix is removed before forwarding (e.g. `/iam/auth/login` → `/auth/login`). This keeps a single, consistent entry point and lets each service use root-relative paths internally.

### Circuit breaker

Each proxied service has a circuit breaker. After a configurable number of failures (e.g. 5xx or connection errors), the circuit opens and the gateway returns 503 for that service without calling it. After a reset timeout it moves to half-open and allows a limited number of probes; success closes the circuit. This prevents cascading failures and avoids hammering an unhealthy backend.

### Rate limiting

A single gateway-wide rate limiter (default 200 requests per minute) is applied before routing. The limit is intentionally higher than typical per-service limits because the gateway aggregates traffic for all backends. When exceeded, the handler returns 429 and sets `Retry-After`.

### Security and observability

- **Helmet** is used for security headers.
- **CORS** is configured (e.g. `origin: "*"`, methods GET/POST/PATCH/DELETE, `Content-Type` and `Authorization` allowed).
- **Request ID:** If the client sends `X-Request-ID`, it is forwarded to downstream services for tracing.
- **Logging:** Morgan “combined” format is used and logged via the shared logger.

### Service registry

Downstream services and their path prefixes are defined in a single registry (`src/proxy/registry.ts`). Adding a new backend requires adding an entry there and setting the corresponding `*_SERVICE_URL` (and optionally timeout) in config.

### Build and runtime

- The gateway depends on workspace packages: `@g4/logger`, `@g4/error-handler`. They are built and included by the root build and by the Dockerfile.
- Docker build must be run from the **repository root** so that workspace layout and shared packages are available.
