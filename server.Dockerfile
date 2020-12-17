FROM node:14

COPY ./game/package.json ./package.json
COPY ./game/dist/ ./

COPY ./ui/dist/ ./ui

RUN yarn install --production

ENV TIME_PER_TICK_MS=150
ENV GAME_START_TIMEOUT_MS=120000
ENV NB_OF_COLONIES=2
ENV KEEP_ALIVE=false
ENV SERVE_UI=false

EXPOSE 8765

ENTRYPOINT [ "/usr/local/bin/node", "index.js" ]