FROM alpine:3

EXPOSE 3000

RUN apk add --no-cache npm

RUN npm install -g pnpm@next-7

RUN mkdir /app
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run generate-prisma
RUN pnpm run generate

ENTRYPOINT [ "node", "/app/dist/src/index.js" ]