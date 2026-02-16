# Build from repository root: docker build -f apis/identity-and-access/Dockerfile .
#
# Build stage: install deps and build identity-and-access (and its workspace deps)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root and lockfile
COPY package.json package-lock.json ./
COPY turbo.json ./

# Copy package.json for each workspace package needed by identity-and-access
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/logger/package.json packages/logger/
COPY packages/error-handler/package.json packages/error-handler/
COPY packages/crypto/package.json packages/crypto/
COPY packages/bcrypt/package.json packages/bcrypt/
COPY packages/schemas/package.json packages/schemas/
COPY packages/validate/package.json packages/validate/
COPY dbs/db-iam/package.json dbs/db-iam/
COPY apis/identity-and-access/package.json apis/identity-and-access/

# Install all dependencies (needed to build)
RUN npm ci

# Copy source for packages, db-iam, and identity-and-access
COPY packages/typescript-config packages/typescript-config/
COPY packages/logger packages/logger/
COPY packages/error-handler packages/error-handler/
COPY packages/crypto packages/crypto/
COPY packages/bcrypt packages/bcrypt/
COPY packages/schemas packages/schemas/
COPY packages/validate packages/validate/
COPY dbs/db-iam dbs/db-iam/
COPY apis/identity-and-access apis/identity-and-access/

# Build identity-and-access and its dependencies (turbo runs ^build first)
RUN npx turbo run build --filter=@g4/identity-and-access

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
COPY packages/crypto/package.json packages/crypto/
COPY packages/bcrypt/package.json packages/bcrypt/
COPY packages/schemas/package.json packages/schemas/
COPY packages/validate/package.json packages/validate/
COPY dbs/db-iam/package.json dbs/db-iam/
COPY apis/identity-and-access/package.json apis/identity-and-access/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/packages/logger/dist packages/logger/dist/
COPY --from=builder /app/packages/error-handler/dist packages/error-handler/dist/
COPY --from=builder /app/packages/crypto/dist packages/crypto/dist/
COPY --from=builder /app/packages/bcrypt/dist packages/bcrypt/dist/
COPY --from=builder /app/packages/schemas/dist packages/schemas/dist/
COPY --from=builder /app/packages/validate/dist packages/validate/dist/
COPY --from=builder /app/dbs/db-iam/build dbs/db-iam/build/
COPY --from=builder /app/apis/identity-and-access/dist apis/identity-and-access/dist/

# Copy generated Prisma client (from db-iam build)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["node", "apis/identity-and-access/dist/index.js"]
