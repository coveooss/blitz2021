FROM node:14-alpine

COPY ./game/package.json ./package.json
COPY ./game/dist/ ./
COPY ./game/maps ./maps

COPY ./ui/dist/ ./ui

RUN yarn install --production

ARG VERSION="DEV"
ARG TARGET="LOCAL-"

ENV TIME_PER_TICK_MS=0
ENV GAME_START_TIMEOUT_MS=0
ENV DELAY_BETWEEN_TICKS_MS=150
ENV NB_OF_CREWS=1
ENV KEEP_ALIVE=true
ENV SERVE_UI=true

ENV NODE_ENV=production
ENV VERSION=${TARGET}${VERSION}

# This is not perfect, but that should prevent at least some poeple from exec'ing into
# the running container
RUN rm /bin/*

EXPOSE 8765

ENTRYPOINT [ "/usr/local/bin/node", "index.js" ]