# AbroadMate BullMQ Background Worker Dockerfile
# Multi-stage production build for Railway / Fly.io / Kubernetes

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Stage 1: Dependencies & Source
FROM base AS builder
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ ./packages/
COPY apps/worker/ ./apps/worker/

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm --filter @abroadmate/database db:generate

# Build worker
RUN pnpm --filter @abroadmate/worker build

# Stage 2: Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/apps/worker/package.json ./apps/worker/package.json

CMD ["node", "apps/worker/dist/index.js"]
