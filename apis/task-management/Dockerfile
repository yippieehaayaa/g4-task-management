# Build from repository root: docker build -f apis/task-management/Dockerfile .
#
# Build stage: install deps and build task-management (and its workspace deps)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root and lockfile
COPY package.json package-lock.json ./
COPY turbo.json ./

# Copy package.json for each workspace package needed by task-management
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/logger/package.json packages/logger/
COPY packages/error-handler/package.json packages/error-handler/
COPY packages/schemas/package.json packages/schemas/
COPY packages/validate/package.json packages/validate/
COPY dbs/db-task-management/package.json dbs/db-task-management/
COPY apis/task-management/package.json apis/task-management/

# Install all dependencies (needed to build)
RUN npm ci

# Copy source for packages, db-task-management, and task-management
COPY packages/typescript-config packages/typescript-config/
COPY packages/logger packages/logger/
COPY packages/error-handler packages/error-handler/
COPY packages/schemas packages/schemas/
COPY packages/validate packages/validate/
COPY dbs/db-task-management dbs/db-task-management/
COPY apis/task-management apis/task-management/

# Build task-management and its dependencies (turbo runs ^build first)
RUN npx turbo run build --filter=@g4/task-management

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
COPY packages/schemas/package.json packages/schemas/
COPY packages/validate/package.json packages/validate/
COPY dbs/db-task-management/package.json dbs/db-task-management/
COPY apis/task-management/package.json apis/task-management/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/packages/logger/dist packages/logger/dist/
COPY --from=builder /app/packages/error-handler/dist packages/error-handler/dist/
COPY --from=builder /app/packages/schemas/dist packages/schemas/dist/
COPY --from=builder /app/packages/validate/dist packages/validate/dist/
COPY --from=builder /app/dbs/db-task-management/build dbs/db-task-management/build/
COPY --from=builder /app/apis/task-management/dist apis/task-management/dist/

# Copy generated Prisma client (from db-task-management build)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

CMD ["node", "apis/task-management/dist/index.js"]
