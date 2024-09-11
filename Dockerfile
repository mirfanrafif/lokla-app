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

# Production FE - Remix

FROM node:18.18.2-buster-slim as production-fe

WORKDIR /app

# Copy the node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package.json
COPY package.json yarn.lock ./

COPY --from=builder /app/apps/lokla-app ./
COPY --from=builder /app/apps/lokla-app/public ./public

EXPOSE 3000

CMD ["yarn", "remix-serve", "./build/index.js"]

# Production BE - NestJS

FROM node:18.18.2-buster-slim as production-be

WORKDIR /app

# Copy the node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock ./

COPY --from=builder /app/dist/apps/ ./dist/apps/

EXPOSE 3000

CMD ["node", "dist/apps/lokla-api/main.js"]

