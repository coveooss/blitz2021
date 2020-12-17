import { Depot } from "./map";

export type UnitType = 'MINER' | 'CART' | 'OUTLAW';
export type TileType = "EMPTY" | "WALL" | "BASE" | "MINE";

export type Position = { x: number, y: number }

export interface TickColony {
    id: string;
    name: string;
    homeBase: Position;
    spawnPoint: Position;
    blitzium: number;
    units: TickColonyUnit[];
    errors: string[];
}

export interface TickColonyUnit {
    id: string;
    type: UnitType;
    blitzium: number;
    position: Position;
    path: Position[];
}

export interface TickMap {
    tiles: TileType[][]
    depots: Depot[]
}

export interface Tick {
    tick: number;
    totalTick: number;
    colonies: TickColony[];
    map: TickMap;
}

export type PlayerTick = Tick & { colonyId: string; }

export interface CommandActionBuy {
    type: 'BUY';
    unitType: UnitType;
}

export interface CommandActionUnit {
    type: 'UNIT';
    action: 'MOVE' | 'ATTACK' | 'PICKUP' | 'MINE' | 'DROP' | 'NONE';
    unitId: string;
    target: Position;
}

export type CommandAction = CommandActionBuy | CommandActionUnit;

export interface Command {
    actions: CommandAction[];
}