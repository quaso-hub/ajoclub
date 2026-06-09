# Multi-stage build for Nuxt.js
# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000

COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
