from typing import List
from game_message import GameMessage, Position, Colony
from game_command import Action, UnitAction, UnitActionType
import random


class Bot:

    def get_next_move(self, game_message: GameMessage) -> List[Action]:
        """
        Here is where the magic happens, for now the moves are random. I bet you can do better ;)

        No path finding is required, you can simply send a destination per unit and the game will move your unit towards
        it in the next turns.
        """
        my_colony: Colony = game_message.get_colonies_by_id()[game_message.colony_id]

        actions: List[UnitAction] = [UnitAction(UnitActionType.MOVE, unit.id, self.get_random_position(
            game_message.map.get_map_size())) for unit in my_colony.units]

        return actions

    def get_random_position(self, map_size: int) -> Position:
        return Position(random.randint(0, map_size), random.randint(0, map_size))
