# Task Management

Task Management service for the G4 task-management platform. Provides CRUD for tasks scoped to the authenticated identity. Uses JWT (RS256) for authentication, permission checks (`tm:tasks:read`, `tm:tasks:write`, `tm:tasks:delete`), and MongoDB (via Prisma, `@g4/db-task-management`) for persistence.

---

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 18 (see repo root `package.json` engines)
- **npm** (workspace uses npm workspaces)
- **MongoDB** with replica set (e.g. `rs0`) for the task-management database
- **Identity and Access (IAM)** service running (for JWT verification via JWKS)

### From repository root (recommended)

The Task Management service is part of a monorepo. Install and build from the **repository root**:

```bash
# From repo root: /g4-task-management
npm install
npm run build
```

Run the Task Management service in development:

```bash
# From repo root
npx turbo run dev --filter=@g4/task-management
```

Or from within the task-management directory (after root install):

```bash
cd apis/task-management
npm run dev
```

### Environment variables

Copy the sample env and set required values:

```bash
cp .env.sample .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `PORT` | Port the Task Management service listens on | `3001` |
| `DATABASE_URL` | MongoDB connection string (must support replica set) | — (required) |
| `JWT_ISSUER` | JWT issuer claim (must match IAM) | `g4-iam` |
| `JWT_AUDIENCE` | JWT audience claim (must match IAM) | `g4-services` |
| `IAM_JWKS_URL` | IAM JWKS endpoint for public key discovery | `http://localhost:3000/.well-known/jwks.json` |

The service verifies access tokens issued by IAM using the JWKS URL; no JWT key files are needed in this service.

### Docker

Build the image from the **repository root** (context must include workspace and shared packages):

```bash
# From repo root
docker build -f apis/task-management/Dockerfile .
```

Run (override env as needed; provide `DATABASE_URL` and ensure IAM is reachable for JWKS):

```bash
docker run -p 3001:3001 \
  -e DATABASE_URL="mongodb://host.docker.internal:27017/task-db?replicaSet=rs0" \
  -e IAM_JWKS_URL="http://host.docker.internal:3000/.well-known/jwks.json" \
  <image-id>
```

---

## API Documentation

Base path: `/` (no prefix). When accessed via the API Gateway, the service is mounted at `/tm` (e.g. `GET /tm/tasks`).

All task routes require a valid JWT in the `Authorization` header: `Bearer <access_token>` (issued by the Identity and Access service).

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check; returns `{ "status": "ok" }`. |

### Tasks (authenticated; permission-based)

Tasks are scoped to the authenticated identity (`req.identity.sub`). Required permissions:

- **Read:** `tm:tasks:read` (list, show)
- **Write:** `tm:tasks:write` (create, update)
- **Delete:** `tm:tasks:delete` (delete)

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `GET` | `/tasks` | `tm:tasks:read` | List tasks. Query: `page`, `limit`, `search`, `status`, `priority`. |
| `POST` | `/tasks` | `tm:tasks:write` | Create a task. Body: see below. |
| `GET` | `/tasks/:id` | `tm:tasks:read` | Get task by ID (must belong to identity). |
| `PATCH` | `/tasks/:id` | `tm:tasks:write` | Update task (partial). Body: see below. |
| `DELETE` | `/tasks/:id` | `tm:tasks:delete` | Soft-delete task. Returns 204. |

#### Query parameters (list tasks)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number (positive integer). |
| `limit` | number | `20` | Page size (1–100). |
| `search` | string | — | Optional search (e.g. title/description). |
| `status` | string | — | Filter by status: `TODO`, `IN_PROGRESS`, `DONE`. |
| `priority` | string | — | Filter by priority: `LOW`, `MEDIUM`, `HIGH`. |

#### Request body (create task)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Task title (1–255 chars). |
| `description` | string | no | Optional description (max 2000 chars). |
| `status` | string | no | `TODO` \| `IN_PROGRESS` \| `DONE`. Defaults to `TODO`. |
| `priority` | string | no | `LOW` \| `MEDIUM` \| `HIGH`. |
| `dueDate` | string (ISO date) | no | Optional due date. |

#### Request body (update task)

All fields optional; only provided fields are updated. Same field rules as create. Use `null` to clear `description` or `dueDate`.

#### Response shape

- **List:** `{ "data": Task[], "meta": { "page", "limit", "total" } }`
- **Create / Show / Update:** `{ "data": Task }`
- **Delete:** No body (204).

Task object includes: `id`, `identityId`, `title`, `description`, `status`, `priority`, `dueDate`, `createdAt`, `updatedAt`, and (if not soft-deleted) no `deletedAt`. Soft-deleted tasks are excluded from list/show.

### Common conventions

- **IDs:** Task IDs are MongoDB ObjectIds (24-char hex). Path param: `:id`.
- **Errors:** Standard JSON error responses; 401 for missing/invalid token, 403 for insufficient permissions, 404 for task not found (or not owned by identity), 429 when rate limited (with `Retry-After` header).
- **Rate limit:** 100 requests per minute per IP (standard draft-7 headers and `Retry-After` on 429).

---

## Assumptions and Decisions

- **Authentication:** Access tokens are issued by the Identity and Access (IAM) service and signed with **RS256**. This service does not issue tokens; it verifies them using **JWKS** from `IAM_JWKS_URL`. The JWT must contain `sub`, `username`, `kind`, `status`, and `permissions` (array of permission strings).
- **Authorization:** Permission-based. The JWT carries a `permissions` array. Routes require `tm:tasks:read`, `tm:tasks:write`, or `tm:tasks:delete`. Permissions are assigned via IAM (roles/policies); this service only checks the presence of the required permission in the token.
- **Database:** **MongoDB** via Prisma (`@g4/db-task-management`). Replica set is required in the connection string (e.g. `?replicaSet=rs0`) for Prisma usage. All task data is scoped by `identityId` (JWT `sub`).
- **Soft delete:** Delete is implemented as soft delete (e.g. `deletedAt`); deleted tasks are excluded from list and show. This allows recovery or audit if needed later.
- **Validation:** Request bodies and query params are validated with Zod schemas from `@g4/schemas/task-management`; invalid payloads return 400 with structured error details.
- **Rate limiting:** Global API rate limit of 100 requests per minute per IP (60s window). Applied to all routes after authentication; health is typically excluded or counted separately depending on middleware order.
- **Security:** Helmet and CORS are enabled. JSON body size limited (e.g. 16kb). Request IDs are attached for tracing. Errors from the DB layer (e.g. `TaskNotFoundError`) are mapped to HTTP 404.
- **Monorepo:** This service depends on workspace packages (`@g4/db-task-management`, `@g4/schemas`, `@g4/validate`, `@g4/logger`, `@g4/error-handler`). Install and build from the repository root; the Dockerfile is intended to be run with the repo root as build context.
- **Gateway:** When used behind the API Gateway, the service is mounted at `/tm`; the gateway strips the prefix and forwards to this service at `/tasks`, etc. The service itself does not use a path prefix.
