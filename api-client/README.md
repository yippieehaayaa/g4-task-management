# API Client (Bruno)

All requests go through the **api-gateway**. No direct service URLs.

## Structure

| Folder        | Service              | Environment   | Base URL              |
|---------------|----------------------|---------------|------------------------|
| `api-gateway/`| Gateway health       | gateway-local | `http://localhost:4000` |
| `iam/`        | Identity and access  | gateway-iam   | `{{baseUrl}}/iam/...`  |
| `tm/`         | Task management      | gateway-tm    | `{{baseUrl}}/tm/...`   |

All environments use the same gateway base URL (`http://localhost:4000`). IAM and TM requests include `/iam` or `/tm` in the path (e.g. `{{baseUrl}}/iam/auth/login`, `{{baseUrl}}/tm/tasks`).

## Usage

1. Start the api-gateway (and downstream services as needed).
2. For **iam** requests: select environment **gateway-iam**.
3. For **tm** requests: select environment **gateway-tm**.
4. For gateway health/readiness: select **gateway-local**.

Login via `iam/auth/login` (gateway-iam) to set `accessToken` / `refreshToken`; use the same env for other IAM requests and for tm (tasks require auth).
