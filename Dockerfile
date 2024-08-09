# Get Dependencies
FROM node:18.18.2-buster-slim as deps

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn

# Build
FROM node:18.18.2-buster-slim as builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn nx run-many --target=build --all --parallel

# Production FE

FROM node:18.18.2-buster-slim as production

WORKDIR /app

COPY --from=builder /app/dist/apps/ ./dist/apps/