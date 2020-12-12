FROM node:14

COPY ./game/package.json ./package.json
COPY ./game/dist/ ./

COPY ./ui/dist/ ./ui

RUN yarn install --production

EXPOSE 3000

ENTRYPOINT [ "node", "index.js" ]
CMD [ "--help" ]