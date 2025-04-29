FROM node:20-alpine AS builder

RUN mkdir -p /usr/local/src/kippenstummel/web
WORKDIR /usr/local/src/kippenstummel/web

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY public ./public
COPY next-env.d.ts ./
COPY next.config.ts ./
COPY tailwind.config.mjs ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./
COPY messages ./messages
COPY .env* ./

ENV NEXT_OUTPUT_MODE=standalone

RUN npm run build

FROM node:20-alpine

RUN mkdir -p /usr/local/bin/kippenstummel/web
WORKDIR /usr/local/bin/kippenstummel/web

VOLUME ["/usr/local/etc/kippenstummel/web"]

COPY --from=builder /usr/local/src/kippenstummel/web/.next/standalone ./
COPY --from=builder /usr/local/src/kippenstummel/web/.next/static ./.next/static
COPY --from=builder /usr/local/src/kippenstummel/web/public ./public

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
