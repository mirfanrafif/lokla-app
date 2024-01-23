FROM node:18.18.2-buster-slim as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx run-many --target=build --all --parallel

EXPOSE 4200

FROM node:18.18.2-buster-slim as production-fe
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist/apps/translation-fe ./
RUN npm install --only=production

CMD ["npm", "run", "start"]

FROM node:18.18.2-buster-slim as production-be

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist/apps/translation-be ./
RUN npm install --only=production

CMD ["node", "main.js"]

