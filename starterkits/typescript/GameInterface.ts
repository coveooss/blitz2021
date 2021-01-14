export interface IPosition {
  x: number;
  y: number;
}

export interface IDepot {
  position: IPosition,
  blitzium: number
}

export type UnitType = 'MINER' | 'CART' | 'OUTLAW';
export type TileType = 'EMPTY' | 'WALL' | 'MINE' | 'BASE';
export type ActionType = 'MOVE' | 'MINE' | 'ATTACK' | 'PICKUP' | 'DROP' | 'NONE';

export interface IUnit {
  id: string,
  type: UnitType,
  blitzium: number,
  position: IPosition,
  path: IPosition[]
}

export interface ICrew {
  id: string,
  name: string,
  homeBase: IPosition,
  blitzium: number,
  totalBlitzium: number,
  units: IUnit[],
  errors: string[],
  prices: {
    MINER: number,
    CART: number,
    OUTLAW: number
  }
}

export interface IRules {
  MAX_MINER_CARGO: number,
  MAX_CART_CARGO: number,
  MAX_MINER_MOVE_CARGO: number
}

export interface IGameTick {
  tick: number,
  totalTick: number,
  crewId: string,
  crews: ICrew[],
  map: {
    tiles: TileType[][],
    depots: IDepot[]
  },
  rules: IRules
}

export interface IBuyAction {
  type: 'BUY'
  unitType: UnitType
}

export interface IUnitAction {
  type: 'UNIT',
  target: IPosition,
  unitId: string,
  action: ActionType
}

export type Action = IBuyAction | IUnitAction;

export interface IGameCommand {
  actions: Action[];
}

export class PointOutOfMapException extends Error {
  constructor(point: IPosition, size: number) {
    super(`Point {${point.x}, ${point.y}} is out of map, x and y must be greater than 0 and less than ${size}.`);
  }
}

export class GameMessage implements IGameTick {
  public readonly tick: number;
  public readonly totalTick: number;
  public readonly crewId: string;
  public readonly crews: ICrew[];
  public readonly map: {
    tiles: TileType[][],
    depots: IDepot[]
  }
  public readonly rules: IRules;

  constructor(private rawTick: IGameTick) {
    Object.assign(this, rawTick);
  }

  public getMapSize(): number {
    return this.map.tiles.length;
  }

  public validateTileExists(position: IPosition) {
    if (position.x < 0 || position.y < 0 || position.x >= this.getMapSize() || position.y >= this.getMapSize()) {
      throw new PointOutOfMapException(position, this.getMapSize());
    }
  }

  public getTileTypeAt(position: IPosition): TileType {
    this.validateTileExists(position);
    return this.rawTick.map.tiles[position.x][position.y];
  }

  public getPlayerMapById() {
    return new Map<string, ICrew>(this.crews.map(c => [c.id, c]));
  }
}
