# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nuxt build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nuxt -u 1001
COPY --from=build --chown=nuxt:nodejs /app/.output ./.output
COPY --from=build /app/package.json ./
USER nuxt
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", ".output/server/index.mjs"]
