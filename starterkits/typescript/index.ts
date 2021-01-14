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
    webSocket.send(JSON.stringify({ type: "REGISTER", crewName: "MyBot TypeScript" }));
  }
};

webSocket.onmessage = (message: WebSocket.MessageEvent) => {
  let rawGameMessage = JSON.parse(message.data.toString())
  let gameMessage = new GameMessage(rawGameMessage);

  let myCrew = gameMessage.getPlayerMapById().get(gameMessage.crewId);
  myCrew.errors.forEach(e => console.error(e));

  webSocket.send(
    JSON.stringify({
      type: "COMMAND",
      tick: gameMessage.tick,
      actions: bot.getNextMove(gameMessage)
    })
  );
};
