#!/usr/bin/env python

import asyncio
import os
import websockets

from bot import Bot
from bot_message import BotMessage, MessageType
from game_message import GameMessage, Colony
from game_command import UnitActionType
from typing import List, Dict


async def run():
    uri = "ws://127.0.0.1:8765"

    async with websockets.connect(uri) as websocket:
        bot = Bot()
        if "TOKEN" in os.environ:
            await websocket.send(BotMessage(type=MessageType.REGISTER, token=os.environ["TOKEN"]).to_json())
        else:
            await websocket.send(BotMessage(type=MessageType.REGISTER, colonyName="MyBot").to_json())

        await game_loop(websocket=websocket, bot=bot)


async def game_loop(websocket: websockets.WebSocketServerProtocol, bot: Bot):
    while True:
        try:
            message = await websocket.recv()
        except websockets.exceptions.ConnectionClosed:
            # Connection is closed, the game is probably over
            break
        game_message: GameMessage = GameMessage.from_json(message)

        my_colony: Dict[str, Colony] = game_message.get_colonies_by_id()[game_message.colonyId]
        print(f"\nTurn {game_message.tick}")
        print(f"\nError? {' '.join(my_colony.errors)}")

        next_move: UnitActionType.MOVE = bot.get_next_move(game_message)
        await websocket.send(BotMessage(type=MessageType.COMMAND, actions=next_move, tick=game_message.tick).to_json())


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(run())
