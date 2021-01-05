import { Position, hash, distanceBetween, equal } from './position'

import bmp from 'bmp-js'
import aStar from 'a-star';
import fs from 'fs';
import { TickMap, TileType } from './types';
import { Game } from './game';
import { logger } from '../logger';

export interface Tile {
    type: TileType,
    position: Position
}

export interface Depot {
    position: Position,
    blitzium: number
}

export interface Path {
    status: 'success' | 'noPath' | 'timeout';
    path: Position[];
    cost: number;
}

export class GameMap {
    public static fromArray(array: TileType[][]) {
        const tiles = array.map((row, x) => row.map((tile, y) => ({ position: { x, y }, type: tile })));

        const height = array.length;
        const width = array[0]?.length | 0;

        return new GameMap(tiles, height, width);
    }

    public static fromFile(mapFile: string) {
        const COLOR_TO_TYLE = new Map<number, TileType>([
            [0x00, "WALL"],
            [0x0000FF, "BASE"], // RED rgb(255, 0, 0);
            [0x00FFFF, "MINE"], // YELLOW rgb(255, 255, 0);
            [0xFFFFFF, "EMPTY"]
        ]);

        let bmpBuffer = fs.readFileSync(mapFile);
        let bmpData = bmp.decode(bmpBuffer);

        if (bmpData.width !== bmpData.height) {
            throw new Error(`Map file is not squared! width:${bmpData.width} height:${bmpData.height}`);
        }

        const tiles: TileType[][] = new Array(bmpData.width);
        for (let x = 0; x < bmpData.width; x++) {

            tiles[x] = new Array(bmpData.height);

            for (let y = 0; y < bmpData.height; y++) {
                let rawValue = bmpData.data.readUIntBE((((y * bmpData.width) + x) * 4) + 1, 3);
                tiles[x][y] = COLOR_TO_TYLE.get(rawValue);

                if (!tiles[x][y]) {
                    throw new Error(`Error parsing file, pixel 0x${rawValue.toString(16)} doesn't match ${JSON.stringify(COLOR_TO_TYLE.keys())} for ${COLOR_TO_TYLE.values()}`);
                }
            }
        }

        return GameMap.fromArray(tiles);
    }

    public static empty(size: number) {
        const tiles = [];
        for (let i = 0; i < size; i++) {
            tiles[i] = Array(size).fill('EMPTY');
        }

        tiles[0][0] = 'BASE';
        tiles[size - 1][0] = 'BASE';
        tiles[0][size - 1] = 'BASE';
        tiles[size - 1][size - 1] = 'BASE';

        tiles[size / 2][size / 2] = 'MINE';

        return GameMap.fromArray(tiles);
    }

    public bases: Tile[] = [];
    public mines: Tile[] = [];
    public depots: Depot[] = [];

    constructor(private tiles: Tile[][], private _height: number, private _width: number) {
        tiles.forEach(row => {
            row.forEach(tile => {
                if (tile.type === 'BASE') {
                    this.bases.push(tile);
                }

                if (tile.type === 'MINE') {
                    this.mines.push(tile);
                }
            });
        });
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    public getTile(from: Position) {
        return this.tiles[from.x][from.y];
    }

    public getNeighbors(from: Position): Tile[] {
        return [
            { x: from.x, y: from.y - 1 },
            { x: from.x, y: from.y + 1 },
            { x: from.x - 1, y: from.y },
            { x: from.x + 1, y: from.y }]
            .filter(this.isInBound.bind(this))
            .map(this.getTile.bind(this))
    }

    public getWalkableNeighbors(from: Position) {
        return this.getNeighbors(from)
            .filter(tile => tile.type === 'EMPTY');
    }

    public isInBound(from: Position) {
        return from.x >= 0 && from.y >= 0 && from.x < this.height && from.y < this.width;
    }

    public serialize(): TickMap {
        const tiles: TileType[][] = [];
        for (let x = 0; x < this._height; x++) {
            const row: TileType[] = [];
            for (let y = 0; y < this._width; y++) {
                row.push(this.getTile({ x, y }).type);
            }
            tiles.push(row);
        }
        return { tiles, depots: this.depots };
    }
}