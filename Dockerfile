FROM node:24-alpine AS base
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node packages/shared/package.json ./packages/shared/
COPY --chown=node:node apps/server/package.json ./apps/server/
COPY --chown=node:node apps/client/package.json ./apps/client/

FROM base AS deps
RUN npm ci

FROM deps AS dev
COPY --chown=node:node . .

FROM dev AS server-dev
EXPOSE 3000
CMD ["npm", "run", "dev:server"]

FROM dev AS client-dev
EXPOSE 5173
CMD ["npm", "run", "dev:client"]

FROM dev AS client-build
RUN npm run build --workspace=@memoro/client

FROM base AS server-build
RUN npm ci --omit=dev --workspace=@memoro/server
COPY --chown=node:node tsconfig.base.json ./
COPY --chown=node:node packages/shared ./packages/shared
COPY --chown=node:node apps/server ./apps/server

FROM node:24-alpine AS server-prod
ENV NODE_ENV=production
USER node
COPY --from=server-build /app /app
WORKDIR /app/apps/server
EXPOSE 3000
CMD ["node", "--import", "tsx", "index.ts"]

FROM nginx:stable-alpine AS client-prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.inc /etc/nginx/conf.d/security-headers.inc
COPY --from=client-build /app/apps/client/dist /usr/share/nginx/html
EXPOSE 80
