from typing import List
from game_message import GameMessage, Position, Colony
from game_command import Action, UnitAction, UnitActionType
import random


class Bot:

    def get_next_move(self, game_message: GameMessage) -> List[Action]:
        """
        Here is where the magic happens, for now the moves are random. I bet you can do better ;)
        """
        my_colony: Colony = game_message.get_colonies_by_id()[game_message.colonyId]

        actions: List[UnitAction] = [UnitAction(UnitActionType.MOVE, unit.id, self.get_random_position(game_message.map.get_map_size())) for unit in my_colony.units]

        # You can print out a pretty version of the map but be aware that
        # printing out long strings can impact your bot performance (30 ms in average).
        # print(game_message.game.pretty_map)

        return actions

    def get_random_position(self, map_size: int) -> Position:
        """
        You should define here what moves are legal for your current position and direction
        so that your bot does not send a lethal move.

        Your bot moves are relative to its direction, if you are in the DOWN direction.
        A TURN_RIGHT move will make your bot move left in the map visualization (replay or logs)
        """

        return Position(random.randint(0, map_size), random.randint(0, map_size))
