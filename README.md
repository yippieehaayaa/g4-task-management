# G4 Task Management Platform

Monorepo for the G4 task-management platform: Identity and Access (IAM), Task Management API, API Gateway, and a web app. Built with Node.js, Turborepo, MongoDB (Prisma), and a shared package set.

---

## Repository structure

| Path | Description |
|------|-------------|
| **`apis/api-gateway`** | Central HTTP gateway: reverse proxy, rate limiting, circuit breaker. Single entry for clients. |
| **`apis/identity-and-access`** | IAM: registration, login, sessions, identities, groups, roles, policies. JWT (RS256) + JWKS. |
| **`apis/task-management`** | Task CRUD scoped to authenticated identity. Permission-based (`tm:tasks:*`). |
| **`apps/task-management-app`** | Web app (TanStack Start, React, Vite). Consumes APIs via the gateway. |
| **`dbs/db-iam`** | Prisma client and models for IAM (MongoDB). |
| **`dbs/db-task-management`** | Prisma client and models for Task Management (MongoDB). |
| **`dbs/redis`** | Redis package (if used). |
| **`packages/schemas`** | Shared Zod schemas (IAM, task-management, etc.). |
| **`packages/validate`** | Express validation middleware (Zod). |
| **`packages/logger`** | Structured logger (Pino). |
| **`packages/error-handler`** | Shared error classes and Express error middleware. |
| **`packages/bcrypt`** | Password hashing. |
| **`packages/crypto`** | Crypto utilities. |
| **`packages/typescript-config`** | Shared TypeScript config. |
| **`api-client`** | Bruno API client collections; all requests go through the API Gateway. |

---

## Setup instructions

### Prerequisites

- **Node.js** ≥ 18 (see root `package.json` engines)
- **npm** (workspace uses npm workspaces)
- **MongoDB** with replica set (e.g. `rs0`) for IAM and Task Management databases

### 1. Install and build (from repository root)

```bash
# Clone and enter repo
cd g4-task-management

# Install all workspace dependencies
npm install

# Build all packages and apps (Turbo builds in dependency order)
npm run build
```

### 2. Environment and services

Each service has its own `.env`. Copy from `.env.sample` in the relevant directory and set variables.

| Service | Port | Notes |
|---------|------|--------|
| **Identity and Access** | `3000` | Needs `DATABASE_URL`, `HASH_SECRET`; in prod `JWT_PRIVATE_KEY_PATH`, `JWT_PUBLIC_KEY_PATH`. |
| **Task Management** | `3001` | Needs `DATABASE_URL`, `IAM_JWKS_URL` (e.g. IAM’s JWKS). |
| **API Gateway** | `4000` | Needs `IAM_SERVICE_URL`, `TM_SERVICE_URL` (defaults point to localhost). |
| **Task Management App** | `5290` (dev) | Needs `VITE_API_URL` (default `http://localhost:4000`). |

**Suggested order for local development:**

1. Start MongoDB (with replica set).
2. Start IAM: `npx turbo run dev --filter=@g4/identity-and-access`
3. Start Task Management: `npx turbo run dev --filter=@g4/task-management`
4. Start API Gateway: `npx turbo run dev --filter=@g4/api-gateway`
5. Start web app: `npx turbo run dev --filter=task-management-app`

Or run everything that has a `dev` script (gateway may run all or a subset depending on root `package.json`):

```bash
npm run dev
```

### 3. Database

- **IAM:** `DATABASE_URL` for IAM DB (e.g. `mongodb://localhost:27017/iam-db?replicaSet=rs0`).
- **Task Management:** `DATABASE_URL` for task DB (e.g. `mongodb://localhost:27017/task-db?replicaSet=rs0`).

From repo root, push Prisma schemas and optionally seed:

```bash
cd dbs/db-iam && npm run push && npm run seed
cd dbs/db-task-management && npm run push && npm run seed
```

### 4. Docker

Images must be built from the **repository root** (context includes workspaces and shared packages):

```bash
# From repo root
docker build -f apis/api-gateway/Dockerfile .
docker build -f apis/identity-and-access/Dockerfile .
docker build -f apis/task-management/Dockerfile .
docker build -f apps/task-management-app/Dockerfile .
```

CI (e.g. `.github/workflows/build.yaml`) builds and pushes these images to a container registry.

---

## API documentation

All client-facing traffic goes through the **API Gateway** (default `http://localhost:4000`). The gateway strips path prefixes and forwards to the backends.

### Gateway routes (gateway itself)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness; returns `{ "status": "ok" }`. |
| `GET` | `/readiness` | Readiness; checks downstream services and circuit breakers. |

### Proxied routes (path prefix → service)

| Prefix | Service | Example |
|--------|---------|--------|
| `/iam` | Identity and Access | `POST /iam/auth/login` → IAM `/auth/login` |
| `/tm` | Task Management | `GET /tm/tasks` → Task Management `/tasks` |

### Identity and Access (IAM) — under `/iam`

- **Public:** `GET /iam/health`, `GET /.well-known/jwks.json` (via gateway, path may differ), `POST /iam/auth/register`, `POST /iam/auth/login`, `POST /iam/auth/refresh`.
- **Auth:** `POST /iam/auth/logout`, `PATCH /iam/auth/password`, `PATCH /iam/auth/email`, `GET /iam/auth/sessions`, `DELETE /iam/auth/sessions/:sessionId`.
- **Account:** `GET /iam/account/identity`.
- **Identities / Groups / Roles / Policies / Admin:** See `apis/identity-and-access/README.md`.

All authenticated IAM routes require `Authorization: Bearer <access_token>` (JWT from IAM).

### Task Management — under `/tm`

- **Public:** `GET /tm/health` (or gateway health).
- **Tasks (authenticated):**  
  - `GET /tm/tasks` — list (query: `page`, `limit`, `search`, `status`, `priority`).  
  - `POST /tm/tasks` — create.  
  - `GET /tm/tasks/:id` — get one.  
  - `PATCH /tm/tasks/:id` — update.  
  - `DELETE /tm/tasks/:id` — soft-delete.

Required permissions: `tm:tasks:read`, `tm:tasks:write`, `tm:tasks:delete` as applicable. Tasks are scoped to the JWT `sub`.

**Detailed API docs (request/response shapes, errors, rate limits):**

- **API Gateway:** `apis/api-gateway/README.md`
- **Identity and Access:** `apis/identity-and-access/README.md`
- **Task Management:** `apis/task-management/README.md`
- **Web app (consumed APIs):** `apps/task-management-app/README.md`
- **Bruno API client:** `api-client/README.md`

---

## Assumptions and decisions

### Architecture

- **Monorepo:** npm workspaces + Turborepo. All installs and production builds run from the repo root. Dockerfiles use the repo root as build context so workspace packages are available.
- **Single entry point:** Clients (including the web app) talk only to the API Gateway. IAM and Task Management are not exposed directly; the gateway does path-based routing (`/iam`, `/tm`), rate limiting, and circuit breaking.
- **Authentication:** IAM issues JWT access tokens (RS256). Other services verify tokens via JWKS (`/.well-known/jwks.json`). Task Management uses `IAM_JWKS_URL`; the gateway may validate or forward the token. No shared secret; each service that needs it uses the public key.

### Data and services

- **Databases:** MongoDB with replica set (e.g. `?replicaSet=rs0`) for IAM and Task Management. Prisma is used via `@g4/db-iam` and `@g4/db-task-management`. Each service has its own DB/connection string.
- **Authorization:** Permission-based. JWTs carry a `permissions` array (e.g. `iam:identities:read`, `tm:tasks:write`). Services enforce required permissions per route; IAM manages roles/policies that grant permissions.
- **Task Management:** Soft delete; list/show exclude deleted tasks. Data scoped by `identityId` (JWT `sub`).

### Cross-cutting

- **Validation:** Request bodies and query params validated with Zod; schemas live in `@g4/schemas`; Express middleware in `@g4/validate`. Invalid requests return 400 with structured errors.
- **Errors and logging:** Shared `@g4/error-handler` and `@g4/logger`. Consistent JSON error responses; 401/403/404/429 with appropriate headers (e.g. `Retry-After` for 429).
- **Rate limiting:** Gateway applies a global limit (e.g. 200 req/min). IAM and Task Management may apply their own limits (e.g. 100 req/min per IP, stricter on auth endpoints).
- **Security:** Helmet and CORS enabled; body size limits; no body parsing at the gateway (streamed to backends).

### Tooling and CI

- **Lint/format:** Biome. TypeScript shared config in `@g4/typescript-config`.
- **Build:** `turbo run build`; `dev` and other tasks defined in `turbo.json`.
- **CI:** GitHub Actions (e.g. `build.yaml`) build and push Docker images for api-gateway, identity-and-access, task-management, and task-management-app.

### API client

- **api-client:** Bruno collections target the gateway only; no direct service URLs. Use gateway base URL (e.g. `http://localhost:4000`) and paths `/iam/...`, `/tm/...` as documented in `api-client/README.md`.

---

## Scripts (from repo root)

| Script | Description |
|--------|-------------|
| `npm run build` | Build all workspaces (Turbo). |
| `npm run dev` | Run dev tasks (Turbo; persistent). |
| `npm run check-types` | Type-check (Turbo). |
| `npm run lint` | Biome check. |
| `npm run format` | Biome format. |
| `npm run deps:audit` | syncpack list. |
| `npm run deps:fix` | syncpack fix-mismatches. |

To run a single app or API:

```bash
npx turbo run dev --filter=@g4/identity-and-access
npx turbo run dev --filter=@g4/task-management
npx turbo run dev --filter=@g4/api-gateway
npx turbo run dev --filter=task-management-app
```

---

## Links

- [Turborepo](https://turbo.build/repo) — tasks, caching, filters
- [Prisma](https://www.prisma.io/) — MongoDB access for IAM and Task Management
- Service READMEs: `apis/api-gateway/README.md`, `apis/identity-and-access/README.md`, `apis/task-management/README.md`, `apps/task-management-app/README.md`, `api-client/README.md`
