import { Position, hash, distanceBetween } from './position'

import bmp from 'bmp-js'
import aStar from 'a-star';
import fs from 'fs';

export type TileType = "EMPTY" | "WALL" | "BASE" | "DEPOT";

export interface Tile {
    type: TileType,
    position: Position
}

export class GameMap {
    public static fromArray(array: TileType[][]) {
        const tiles = new Map(array.flatMap((row, x) => row.map((type: TileType, y) => [hash({ x, y }), { position: { x, y }, type }])));

        const height = array.length;
        const width = array[0]?.length | 0;

        return new GameMap(tiles, height, width);
    }

    public static fromFile(mapFile: string) {
        const COLOR_TO_TYLE = new Map<number, TileType>([
            [0, "WALL"],
            [16777215, "EMPTY"]
        ]);

        let bmpBuffer = fs.readFileSync(mapFile);
        let bmpData = bmp.decode(bmpBuffer);

        const tiles = new Map<String, Tile>();
        for (let x = 0; x < bmpData.height; x++) {
            for (let y = 0; y < bmpData.width; y++) {
                tiles.set(
                    hash({ x, y }),
                    {
                        position: { x, y },
                        type: COLOR_TO_TYLE.get(bmpData.data.readUIntBE((((x * bmpData.width) + y) * 4) + 1, 3))
                    });
            }
        }
        console.log(tiles.values());
    }

    constructor(private tiles: Map<String, Tile>, private _height: number, private _width: number) { }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    public getTile(from: Position) {
        return this.tiles.get(hash(from));
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
        return this.getNeighbors(from).filter(tile => tile.type === 'EMPTY');
    }

    public isInBound(from: Position) {
        return from.x >= 0 && from.y >= 0 && from.x < this.height && from.y < this.width;
    }

    public computePath(from: Position, to: Position) {
        return aStar<Position>({
            start: from,
            isEnd: (node) => hash(node) === hash(to),
            neighbor: (node) => this.getWalkableNeighbors(node).map(tile => tile.position),
            distance: distanceBetween,
            hash: hash,
            heuristic: (node) => 1
        });
    }
}