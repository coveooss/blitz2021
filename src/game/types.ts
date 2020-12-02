import { TileType } from "./map";

export type UnitType = 'MINER' | 'CART' | 'COWBOY';
export type Tiletype = 'E' | 'X' | 'M'; // EMPTY, ROCK/WALL, MINE

export type Position = { x: number, y: number }

export interface TickColony {
    id: string,
    name: string,
    homeBase: Position,
    blitzium: number;
    units: TickColonyUnit[]
}

export interface TickColonyUnit {
    id: string,
    type: UnitType,
    blitzium: number,
    position: Position,
}

export interface TickMap {
    tiles: TileType[][]
}

export interface Tick {
    tick: number,
    totalTick: number,
    colonyId: number,
    colonies: TickColonyUnit[],
    map: TickMap,
    errors: string[]
}

export interface CommandActionBuy {
    type: 'BUY',
    unitType: UnitType
}

export interface CommandActionUnit {
    type: 'UNIT',
    action: 'MOVE' | 'ATTACK' | 'PICKUP' | 'NONE',
    unitId: string,
    target: Position,
}

export type CommandAction = CommandActionBuy | CommandActionUnit;

export interface Command {
    actions: CommandAction[]
}