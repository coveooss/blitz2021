from dataclasses import dataclass
from dataclasses_json import dataclass_json
from enum import Enum
from game_message import Position, UnitType
from typing import List


@dataclass_json
class ActionType(Enum):
    BUY = "BUY"
    UNIT = "UNIT"


@dataclass_json
class Action:
    type: ActionType
    
    def __init__(self, type):
        self.type = type


@dataclass_json
class BuyAction(Action):
    unit_type: UnitType

    def __init__(self, unit_type: UnitType):
        super().__init__(ActionType.BUY)
        self.unit_type: unit_type


@dataclass_json
class UnitActionType(Enum):
    MOVE = "MOVE"
    ATTACK = "ATTACK" 
    PICKUP = "PICKUP"
    MINE = "MINE"
    DROP = "DROP" 
    NONE = "NONE"


@dataclass_json
@dataclass
class UnitAction(Action):
    target: Position
    action: UnitActionType
    unitId: str

    def __init__(self, action: UnitActionType, unit_id: str, target: Position):
        super().__init__(ActionType.UNIT)
        self.action = action
        self.unitId = unit_id
        self.target = target


@dataclass_json
class GameCommand:
    actions: List[Action]

    def __init__(self, actions: List[Action]):
        self.actions = actions
