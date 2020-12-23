FROM node:14

COPY ./game/package.json ./package.json
COPY ./game/dist/ ./
COPY ./game/maps ./maps

COPY ./ui/dist/ ./ui

RUN yarn install --production

ENV TIME_PER_TICK_MS=0
ENV GAME_START_TIMEOUT_MS=0
ENV NB_OF_COLONIES=1
ENV KEEP_ALIVE=true
ENV SERVE_UI=true

ENV NODE_ENV=production

EXPOSE 8765

ENTRYPOINT [ "/usr/local/bin/node", "index.js" ]