FROM node:14

COPY ./game/package.json ./package.json
COPY ./game/dist/ ./
COPY ./game/maps ./maps

RUN yarn install --production

ARG VERSION="DEV"
ARG TARGET="SERVER-"

ENV TIME_PER_TICK_MS=150
ENV GAME_START_TIMEOUT_MS=120000
ENV KEEP_ALIVE=false
ENV SERVE_UI=false

ENV NODE_ENV=production
ENV VERSION=${TARGET}${VERSION}

ENV NODE_ENV=production

EXPOSE 8765

ENTRYPOINT [ "/usr/local/bin/node", "index.js" ]