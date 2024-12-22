FROM node:23.5-alpine AS builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm install

COPY frontend ./

RUN npm run build

FROM node:23.5-alpine

ENV NODE_ENV=development
ENV npm_config_ignore_scripts=true

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm install

EXPOSE 3000

CMD ["npm", "run" "dev"]
