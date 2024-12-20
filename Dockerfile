FROM node:23-alpine

ARG DEFAULT_PORT=3000

ENV PORT $DEFAULT_PORT

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE $PORT

CMD ["node", "dist/main"]
