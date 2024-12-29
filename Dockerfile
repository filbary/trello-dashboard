FROM node:23.5-alpine AS builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm install

COPY frontend ./

ARG NEXT_PUBLIC_TRELLO_API_KEY
ARG NEXT_PUBLIC_TRELLO_API_TOKEN

ENV NEXT_PUBLIC_TRELLO_API_KEY=$NEXT_PUBLIC_TRELLO_API_KEY
ENV NEXT_PUBLIC_TRELLO_API_TOKEN=$NEXT_PUBLIC_TRELLO_API_TOKEN

RUN npm run build

FROM node:23.5-alpine

ENV NODE_ENV=production
ENV npm_config_ignore_scripts=true

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
