# Get Dependencies
FROM node:18.18.2-buster-slim as deps

WORKDIR /app

COPY package*.json ./
RUN npm install

# Build
FROM node:18.18.2-buster-slim as builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npx nx run-many --target=build --all --parallel

# Production Image - Frontend
FROM node:18.18.2-buster-slim as production-fe
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist/apps/translation-app/next.config.js ./
COPY --from=builder /app/dist/apps/translation-app/public ./public
COPY --from=builder /app/dist/apps/translation-app/.next/static ./dist/apps/translation-app/.next/static
COPY --from=builder /app/dist/apps/translation-app/.next/standalone ./

EXPOSE 3000

CMD ["node", "apps/translation-app/server.js"]

# Production Image - Backend
FROM node:18.18.2-buster-slim as production-be

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist/apps/translation-api ./
RUN npm install --only=production

EXPOSE 3001

CMD ["node", "main.js"]

