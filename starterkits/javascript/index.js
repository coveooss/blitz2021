const WebSocket = require("ws");
const { Bot } = require("./Bot");

const webSocket = new WebSocket("ws://0.0.0.0:8765");
let bot;

webSocket.onopen = function (event) {
  bot = new Bot();
  if (process.env.TOKEN) {
    webSocket.send(
      JSON.stringify({ type: "REGISTER", token: process.env.TOKEN })
    );
  } else {
    webSocket.send(JSON.stringify({ type: "REGISTER", crewName: "MyBot" }));
  }
};

webSocket.onmessage = function (message) {
  let data = JSON.parse(message.data.toString())

  let myCrew = data.crews.find(c => c.id === data.crewId);
  myCrew.errors.forEach(e => console.error(e));

  webSocket.send(
    JSON.stringify({
      type: "COMMAND",
      tick: data.tick,
      actions: bot.getNextMove(data)
    })
  );
};
