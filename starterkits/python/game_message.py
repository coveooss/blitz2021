from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from enum import Enum
from typing import List, Dict



class TileType(Enum):
    EMPTY = "EMPTY"
    WALL = "WALL"
    MINE = "MINE"
    BASE = "BASE"

    @staticmethod
    def get_tile_type(raw_tile: str) -> 'TileType':
        for tile_type in TileType:
            if raw_tile == tile_type.value:
                return tile_type
        else:
            raise Exception(f"Tile '{raw_tile}'' is not a valid tile.")

@dataclass
class Depot:
    position: Position
    blitzium: int

@dataclass
class Position:
    x: int
    y: int

@dataclass 
class Map:
    tiles: List[List[str]]

    def get_map_size():
        return len(tiles)

    def validate_tile_exists(self, position: Position):
        if(position.x < 0 or position.y < 0 or position.x >= self.get_map_size() or position.y >= self.get_map_size()):
            raise "Position out is of map"
    
    def get_raw_tile_value_at(self, position: Position):
        self.validate_tile_exists(position)
        return self.tiles[position.y][position.x]

    def get_tile_type_at(self, position: Position): 
        raw_tile = 

class TileType(Enum):
    MINER = "MINER"
    CART = "CART"
    OUTLAW = "OUTLAW"

@dataclass
class Unit:
    id: str
    type: UnitType
    blitzium: int
    position: Position
    path: List[Position]

@dataclass
class Colony:
    id: str
    name: str
    spawnPoint: Position
    blitzium: int
    totalBlitzium: int
    units: List[Unit]
    errors: str
}

@dataclass_json
@dataclass
class GameMessage:
    tick: int
    totalTick: int
    colonyId: str
    colonies: List[Colony]
    map: List[List[str]]

    def get_colonies_by_id_dict(self) -> Dict[str, Colony]:
        return {colony.id: colony for colony in self.colonies}