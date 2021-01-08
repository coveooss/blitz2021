import { Depot } from "./map";

export type UnitType = 'MINER' | 'CART' | 'OUTLAW';
export type TileType = "EMPTY" | "WALL" | "BASE" | "MINE";

export type Position = { x: number, y: number }

export interface TickColony {
    id: string;
    name: string;
    homeBase: Position;
    safeZoneRadius: number;
    blitzium: number;
    totalBlitzium: number;
    units: TickColonyUnit[];
    errors: string[];
    prices: { [key: string]: number }
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
    rules: {
        MAX_MINER_CARGO: number,
        MAX_CART_CARGO: number,
        MAX_MINER_MOVE_CARGO: number,
    }
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