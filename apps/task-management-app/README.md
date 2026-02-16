# Task Management App

Web application for the G4 task-management platform. Built with TanStack Start (React), Vite, TanStack Query, and Redux. Consumes the Identity and Access (IAM) and Task Management APIs via the API Gateway.

---

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 18 (see repository root `package.json` engines)
- **npm** (monorepo uses npm workspaces)
- **API Gateway** (and optionally IAM + Task Management services) for full functionality. For local development, the app expects the gateway at `VITE_API_URL` (default `http://localhost:4000`).

### From repository root (recommended)

The app is part of a monorepo. Install and build from the **repository root**:

```bash
# From repo root: /g4-task-management
npm install
npm run build
```

Run the app in development:

```bash
# From repo root
npx turbo run dev --filter=task-management-app
```

Or from within the app directory (after root install):

```bash
cd apps/task-management-app
npm run dev
```

The dev server runs at **http://localhost:5290** (see `package.json` scripts).

### Environment variables

Copy the sample env and set the API base URL:

```bash
cp .env.sample .env
```

| Variable        | Description                                      | Default                 |
|----------------|---------------------------------------------------|-------------------------|
| `VITE_API_URL` | Base URL of the API Gateway (all API calls use this) | `http://localhost:4000` |

The app sends all requests (IAM auth, account, sessions; Task Management CRUD) to this URL. Ensure the API Gateway is running and configured to proxy to IAM and Task Management (see `apis/api-gateway/README.md`).

### Docker

Build the image from the **repository root** (context must include workspace and shared packages such as `@g4/schemas`):

```bash
# From repo root
docker build -f apps/task-management-app/Dockerfile .
```

Run (override env as needed; in production, set `VITE_API_URL` at build time or ensure the client is served with the correct API URL):

```bash
docker run -p 80:80 <image-id>
```

The container runs Nginx (port 80) reverse-proxying to the Node SSR server (port 3000 internally). Static assets and server-rendered pages are served through Nginx.

---

## API Documentation

The app does not expose its own REST API. It **consumes** the following backend APIs through the **API Gateway**. The gateway is the single origin for the app (`VITE_API_URL`); paths below are relative to that base URL.

### Identity and Access (IAM)

Used for authentication, account, and session management.

| Method   | Path                     | Description |
|----------|--------------------------|-------------|
| `POST`   | `/iam/auth/register`     | Register. Body: `{ "username", "password" }` (optional: `email`, `kind`). |
| `POST`   | `/iam/auth/login`        | Login. Body: `{ "username", "password" }`. Returns `{ "data": { "accessToken", "refreshToken" } }`. |
| `POST`   | `/iam/auth/refresh`      | Refresh access token. Body: `{ "refreshToken" }`. |
| `POST`   | `/iam/auth/logout`       | Logout. Body: `{ "refreshToken" }`. |
| `PATCH`  | `/iam/auth/password`     | Change password. Body: `{ "currentPassword", "newPassword" }`. |
| `PATCH`  | `/iam/auth/email`       | Change email. Body: `{ "newEmail" }`. |
| `GET`    | `/iam/auth/sessions`    | List current identity’s sessions. |
| `DELETE` | `/iam/auth/sessions/:sessionId` | Revoke a session. |
| `GET`    | `/iam/account/identity` | Current identity (requires `Authorization: Bearer <access_token>`). |

All authenticated requests use the stored access token; 401 responses trigger a refresh attempt via `/iam/auth/refresh` and then a retry.

Full IAM API details: `apis/identity-and-access/README.md`.

### Task Management (TM)

Used for task CRUD. All task routes require a valid JWT and the appropriate permissions (`tm:tasks:read`, `tm:tasks:write`, `tm:tasks:delete`).

| Method   | Path           | Description |
|----------|----------------|-------------|
| `GET`    | `/tm/tasks`    | List tasks. Query: `page`, `limit`, `search`, `status`, `priority`. |
| `GET`    | `/tm/tasks/:id`| Get task by ID. |
| `POST`   | `/tm/tasks`    | Create task. Body: `title` (required), optional `description`, `status`, `priority`, `dueDate`. |
| `PATCH`  | `/tm/tasks/:id`| Update task (partial). Same body shape as create; only provided fields updated. |
| `DELETE` | `/tm/tasks/:id`| Soft-delete task. Returns 204. |

List response: `{ "data": Task[], "meta": { "page", "limit", "total" } }`. Single resource: `{ "data": Task }`.

Full Task Management API details: `apis/task-management/README.md`.

### Client usage

- **API client:** `src/api/client.ts` — `api.get`, `api.post`, `api.patch`, `api.delete` with Bearer token and automatic refresh on 401.
- **Task Management:** hooks and query options in `src/api/task-management/` (e.g. `listQuery`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`).
- **IAM:** hooks and queries in `src/api/iam/` (e.g. `useLogin`, `useRegister`, `useRefreshToken`, `getAccountIdentity`).

---

## Assumptions and Decisions

- **Monorepo:** The app depends on workspace packages (e.g. `@g4/schemas`). Install and build from the repository root; the Dockerfile assumes the repo root as build context so that `turbo run build --filter=task-management-app` can run.
- **API Gateway:** The app is designed to talk to a **single origin** (the API Gateway). All backend calls use `VITE_API_URL`; the gateway is responsible for routing `/iam/*` and `/tm/*` to the IAM and Task Management services. Running the app without the gateway (or with wrong `VITE_API_URL`) will cause API requests to fail.
- **Authentication:** Access and refresh tokens are stored in memory in the API client (`src/api/client.ts`). Login/register set them via `setTokens`; logout and failed refresh clear them. No cookies or long-lived localStorage for tokens in the current design. Session persistence across page reloads relies on refresh token flow (e.g. re-hydration from stored refresh token if that is added elsewhere).
- **SSR and deployment:** The app is built with TanStack Start (SSR). The Docker image runs the built Node server and Nginx; Nginx proxies to the Node server for SSR and API passthrough as configured. Port 80 is the only exposed port.
- **Tooling:** Vite 7, TanStack Router, TanStack Query, Redux, Tailwind CSS v4, Biome for lint/format. Dev server port is 5290 to avoid clashing with IAM (3000), Task Management (3001), and API Gateway (4000).
- **Feature set:** The app implements login, registration, session management, password/email change, dashboard, task list with filters and CRUD, and settings. It assumes the IAM and Task Management services (and gateway) are available and that identities have the required `tm:tasks:*` permissions for task features.
