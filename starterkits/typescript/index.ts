import WebSocket from "ws";
import { Bot } from "./Bot";
import { GameMessage } from "./GameInterface";

const webSocket = new WebSocket("ws://0.0.0.0:8765");
let bot;

webSocket.onopen = (event: WebSocket.OpenEvent) => {
  bot = new Bot();
  if (process.env.TOKEN) {
    webSocket.send(
      JSON.stringify({ type: "REGISTER", token: process.env.TOKEN })
    );
  } else {
    webSocket.send(JSON.stringify({ type: "REGISTER", colonyName: "MyBot TypeScript" }));
  }
};

webSocket.onmessage = (message: WebSocket.MessageEvent) => {
  let rawGameMessage = JSON.parse(message.data.toString())
  let gameMessage = new GameMessage(rawGameMessage);

  let myColony = gameMessage.getPlayerMapById().get(gameMessage.colonyId);
  myColony.errors.forEach(e => console.error(e));

  webSocket.send(
    JSON.stringify({
      type: "COMMAND",
      actions: bot.getNextMove(gameMessage)
    })
  );
};
