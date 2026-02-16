# Build from repository root: docker build -f apis/api-gateway/Dockerfile .
#
# Build stage: install deps and build api-gateway (and its workspace deps)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root and lockfile
COPY package.json package-lock.json ./
COPY turbo.json ./

# Copy package.json for each workspace package needed by api-gateway
COPY packages/logger/package.json packages/logger/
COPY packages/error-handler/package.json packages/error-handler/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY apis/api-gateway/package.json apis/api-gateway/

# Install all dependencies (needed to build)
RUN npm ci

# Copy source for packages and api-gateway
COPY packages/logger packages/logger/
COPY packages/error-handler packages/error-handler/
COPY packages/typescript-config packages/typescript-config/
COPY apis/api-gateway apis/api-gateway/

# Build api-gateway and its dependencies (turbo runs ^build first)
RUN npx turbo run build --filter=@g4/api-gateway

# Production stage: only runtime artifacts
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy workspace root and lockfile
COPY package.json package-lock.json ./
COPY turbo.json ./

# Copy package.json for runtime workspace packages
COPY packages/logger/package.json packages/logger/
COPY packages/error-handler/package.json packages/error-handler/
COPY apis/api-gateway/package.json apis/api-gateway/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/packages/logger/dist packages/logger/dist/
COPY --from=builder /app/packages/error-handler/dist packages/error-handler/dist/
COPY --from=builder /app/apis/api-gateway/dist apis/api-gateway/dist/

EXPOSE 4000

CMD ["node", "apis/api-gateway/dist/index.js"]
