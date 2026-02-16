# Identity and Access (IAM)

Identity and Access Management service for the G4 task-management platform. Handles registration, login, sessions, identities, groups, roles, policies, and admin operations. Uses JWT (RS256) for access tokens and MongoDB (via Prisma) for persistence.

---

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 18 (see repo root `package.json` engines)
- **npm** (workspace uses npm workspaces)
- **MongoDB** with replica set (e.g. `rs0`) for the IAM database

### From repository root (recommended)

The IAM service is part of a monorepo. Install and build from the **repository root**:

```bash
# From repo root: /g4-task-management
npm install
npm run build
```

Run the IAM service in development:

```bash
# From repo root
npx turbo run dev --filter=@g4/identity-and-access
```

Or from within the identity-and-access directory (after root install):

```bash
cd apis/identity-and-access
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
| `PORT` | Port the IAM service listens on | `3000` |
| `DATABASE_URL` | MongoDB connection string (must support replica set) | — (required) |
| `JWT_ISSUER` | JWT issuer claim | `g4-iam` |
| `JWT_AUDIENCE` | JWT audience claim | `g4-services` |
| `ACCESS_TOKEN_EXPIRY` | Access token TTL (e.g. `15m`, `1h`) | `15m` |
| `REFRESH_TOKEN_EXPIRY_HOURS` | Refresh token TTL in hours | `168` (7 days) |
| `JWT_PRIVATE_KEY_PATH` | Path to RS256 private key PEM | — (required in production) |
| `JWT_PUBLIC_KEY_PATH` | Path to RS256 public key PEM | — (required in production) |
| `HASH_SECRET` | Secret for HMAC hashing (e.g. refresh tokens) | — (required) |

In **development**, if `JWT_PRIVATE_KEY_PATH` and `JWT_PUBLIC_KEY_PATH` are not set, the service generates ephemeral RS256 keys at startup (not for production). In **production**, both key paths must be set.

### Docker

Build the image from the **repository root** (context must include workspace and shared packages):

```bash
# From repo root
docker build -f apis/identity-and-access/Dockerfile .
```

Run (override env as needed; provide `DATABASE_URL`, `HASH_SECRET`, and in production the JWT key paths):

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="mongodb://host.docker.internal:27017/iam-db?replicaSet=rs0" \
  -e HASH_SECRET="your-secret" \
  <image-id>
```

---

## API Documentation

Base path: `/` (no prefix). All authenticated routes require a valid JWT in the `Authorization` header: `Bearer <access_token>`.

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check; returns `{ "status": "ok" }`. |
| `GET` | `/.well-known/jwks.json` | JWKS for verifying IAM-issued access tokens. |
| `POST` | `/auth/register` | Register a new identity. Body: `{ "username", "password" }` (optional: `email`, `kind`). Rate limited (5 req/min). |
| `POST` | `/auth/login` | Login. Body: `{ "username", "password" }`. Returns access + refresh tokens. Rate limited (5 req/min). |
| `POST` | `/auth/refresh` | Issue new access token. Body: `{ "refreshToken" }`. |

### Auth (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/logout` | Invalidate refresh token. Body: `{ "refreshToken" }`. |
| `PATCH` | `/auth/password` | Change password. Body: `{ "currentPassword", "newPassword" }`. |
| `PATCH` | `/auth/email` | Change email. Body: `{ "newEmail" }`. |
| `GET` | `/auth/sessions` | List current identity’s sessions. |
| `DELETE` | `/auth/sessions/:sessionId` | Revoke a session by ID. |

### Account (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/account/identity` | Current identity (from JWT). |

### Identities (authenticated; permission-based)

Requires `iam:identities:read` / `iam:identities:write` / `iam:identities:delete` as applicable.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/identities` | List identities. Query: `page`, `limit`, `search`, `status`, `kind`. |
| `GET` | `/identities/:id` | Get identity by ID. |
| `PATCH` | `/identities/:id` | Update identity. Body: `status`, `kind`, `active` (optional). |
| `DELETE` | `/identities/:id` | Delete identity. |
| `POST` | `/identities/:id/deactivate` | Deactivate identity. |

### Groups (authenticated; permission-based)

Requires `iam:groups:read` / `iam:groups:write` / `iam:groups:delete`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/groups` | List groups. Query: `page`, `limit`, `search`. |
| `POST` | `/groups` | Create group. |
| `GET` | `/groups/:id` | Get group by ID. |
| `PATCH` | `/groups/:id` | Update group. |
| `DELETE` | `/groups/:id` | Delete group. |
| `POST` | `/groups/:id/identities` | Add identities to group. |
| `DELETE` | `/groups/:id/identities` | Remove identities from group. |
| `POST` | `/groups/:id/roles` | Add roles to group. |
| `DELETE` | `/groups/:id/roles` | Remove roles from group. |

### Roles (authenticated; permission-based)

Requires `iam:roles:read` / `iam:roles:write` / `iam:roles:delete`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/roles` | List roles. Query: `page`, `limit`, `search`. |
| `POST` | `/roles` | Create role. |
| `GET` | `/roles/:id` | Get role by ID. |
| `PATCH` | `/roles/:id` | Update role. |
| `DELETE` | `/roles/:id` | Delete role. |
| `POST` | `/roles/:id/policies` | Attach policies to role. |
| `DELETE` | `/roles/:id/policies` | Detach policies from role. |
| `POST` | `/roles/:id/identities` | Assign role to identity. |
| `DELETE` | `/roles/:id/identities` | Remove role from identity. |

### Policies (authenticated; permission-based)

Requires `iam:policies:read` / `iam:policies:write` / `iam:policies:delete`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/policies` | List policies. Query: `page`, `limit`, `search`. |
| `POST` | `/policies` | Create policy. |
| `GET` | `/policies/:id` | Get policy by ID. |
| `PATCH` | `/policies/:id` | Update policy. |
| `DELETE` | `/policies/:id` | Delete policy. |

### Admin (authenticated; permission-based)

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `POST` | `/admin/identities/:identityId/unlock` | `iam:identities:write` | Unlock identity. |
| `GET` | `/admin/identities/:identityId/sessions` | `iam:sessions:read` | List sessions for identity. |
| `DELETE` | `/admin/identities/:identityId/sessions/:sessionId` | `iam:sessions:write` | Revoke one session. |
| `DELETE` | `/admin/identities/:identityId/sessions` | `iam:sessions:write` | Revoke all sessions for identity. |
| `GET` | `/admin/identities/:identityId/otps` | `iam:otps:read` | List OTPs for identity. |
| `POST` | `/admin/identities/:identityId/otps/expire` | `iam:otps:write` | Expire OTPs for identity. |

### Common conventions

- **IDs**: Resource IDs are MongoDB ObjectIds (24-char hex); path params use `:id`, `:sessionId`, or `:identityId` as shown.
- **Pagination**: List endpoints support `page` (default `1`), `limit` (default `20`, max `100`), and often `search`.
- **Errors**: Standard JSON error responses; 401 for missing/invalid token, 403 for insufficient permissions, 429 when rate limited (with `Retry-After` header).

---

## Assumptions and Decisions

- **JWT**: Access tokens are signed with **RS256**. Public keys are exposed at `/.well-known/jwks.json` so other services (e.g. API Gateway, Task Management) can verify tokens without calling IAM. Refresh tokens are opaque and validated by this service only.
- **Database**: **MongoDB** via Prisma (`@g4/db-iam`). Replica set is required in the connection string (e.g. `?replicaSet=rs0`) for Prisma usage assumptions.
- **Permissions**: Permission-based access control. The JWT carries a `permissions` array (e.g. `iam:identities:read`, `iam:roles:write`). Routes use `authorize(...permissions)`; identities get permissions through roles (and optionally groups that have roles). Policy/role/group definitions live in the shared `@g4/schemas` package.
- **Rate limiting**: Auth endpoints (`/auth/register`, `/auth/login`) are limited to 5 requests per minute per IP; general API is limited to 100 requests per minute per IP. 429 responses include a `Retry-After` header.
- **Security**: Helmet and CORS are enabled. Passwords are hashed (e.g. via `@g4/bcrypt`). `HASH_SECRET` is required for HMAC operations (e.g. refresh token handling). In production, JWT keys must be provided via files; development may use ephemeral keys.
- **Monorepo**: IAM depends on workspace packages (`@g4/db-iam`, `@g4/schemas`, `@g4/validate`, `@g4/logger`, `@g4/error-handler`, `@g4/bcrypt`, etc.). Install and build from the repository root; the Dockerfile is intended to be run with the repo root as build context.
