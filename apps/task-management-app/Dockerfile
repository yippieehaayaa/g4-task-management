# Build from repository root: docker build -f apps/task-management-app/Dockerfile .
#
# Build stage: install deps and build task-management-app (and workspace deps)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root and lockfile
COPY package.json package-lock.json ./
COPY turbo.json ./

# Copy package.json for each workspace package needed by task-management-app
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/schemas/package.json packages/schemas/
COPY apps/task-management-app/package.json apps/task-management-app/

# Install all dependencies (needed to build)
RUN npm ci

# Copy source for packages and app
COPY packages/typescript-config packages/typescript-config/
COPY packages/schemas packages/schemas/
COPY apps/task-management-app apps/task-management-app/

# Build task-management-app and its dependencies (turbo runs ^build first)
RUN npx turbo run build --filter=task-management-app

# Production stage: Node + Nginx (Nginx reverse-proxies to Node server)
FROM node:20-alpine AS runner

RUN apk add --no-cache nginx

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy workspace root and lockfile
COPY package.json package-lock.json ./
COPY turbo.json ./

# Copy package.json for runtime workspace packages
COPY packages/schemas/package.json packages/schemas/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY apps/task-management-app/package.json apps/task-management-app/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/packages/schemas/dist packages/schemas/dist/
COPY --from=builder /app/apps/task-management-app/dist apps/task-management-app/dist/

# Nginx config (proxy to Node + serve static client assets)
COPY apps/task-management-app/nginx.conf /etc/nginx/http.d/default.conf

# Copy server runner (wraps fetch handler in Node HTTP server)
COPY --from=builder /app/apps/task-management-app/server-runner.mjs apps/task-management-app/

# Entrypoint: start Node server in background, then Nginx in foreground
RUN echo '#!/bin/sh' > /entrypoint.sh \
  && echo 'node apps/task-management-app/server-runner.mjs &' >> /entrypoint.sh \
  && echo 'sleep 2' >> /entrypoint.sh \
  && echo 'exec nginx -g "daemon off;"' >> /entrypoint.sh \
  && chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
