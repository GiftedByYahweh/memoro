FROM node:24-alpine AS base

WORKDIR /app

# Copy monorepo package manifests
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/
COPY apps/client/package.json ./apps/client/

# Install dependencies inside the container
RUN npm install

# Copy source code
COPY . .

# Target: Server development (tsx watch)
FROM base AS server-dev
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "dev:server"]

# Target: Client development (vite)
FROM base AS client-dev
WORKDIR /app
EXPOSE 5173
CMD ["npm", "run", "dev:client"]

# Target: Production builder (for staging / deployment)
FROM base AS builder
RUN npm run build --workspaces --if-present

# Target: Server production
FROM node:24-alpine AS server-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/server ./apps/server
EXPOSE 3000
CMD ["node", "apps/server/dist/server.js"]
