import { Game } from '../src/game/game';
import { GameMap } from '../src/game/map';
import { TileType } from '../src/game/types';

describe("Map", () => {
    const SIMPLE_MAP: TileType[][] = [
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['WALL', 'BASE', 'WALL', 'WALL', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'WALL', 'WALL', 'WALL', 'WALL'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['WALL', 'WALL', 'WALL', 'MINE', 'WALL'],
    ]

    const SIMPLE_MAP_HEIGHT = 6;
    const SIMPLE_MAP_WIDTH = 5;

    const SIMPLE_MAP_PATH_FROM_0_4_TO_0_0 = [
        { x: 0, y: 4 }, { x: 0, y: 3 },
        { x: 0, y: 2 }, { x: 0, y: 1 },
        { x: 0, y: 0 },
    ];

    const SIMPLE_MAP_PATH_FROM_0_0_TO_5_4 = [
        { x: 0, y: 0 }, { x: 0, y: 1 },
        { x: 0, y: 2 }, { x: 0, y: 3 },
        { x: 0, y: 4 }, { x: 1, y: 4 },
        { x: 2, y: 4 }, { x: 2, y: 3 },
        { x: 2, y: 2 }, { x: 2, y: 1 },
        { x: 2, y: 0 }, { x: 3, y: 0 },
        { x: 4, y: 0 }, { x: 4, y: 1 },
        { x: 4, y: 2 }, { x: 4, y: 3 },
        { x: 4, y: 4 }
    ];

    it("should import the map from an array", () => {
        const gameMap = GameMap.fromArray(SIMPLE_MAP);

        expect(gameMap.height).toBe(SIMPLE_MAP_HEIGHT);
        expect(gameMap.width).toBe(SIMPLE_MAP_WIDTH);

        expect(gameMap.getTile({ x: 0, y: 0 })).toEqual({ position: { x: 0, y: 0 }, type: "EMPTY" });
        expect(gameMap.getTile({ x: 5, y: 4 })).toEqual({ position: { x: 5, y: 4 }, type: "WALL" });
        expect(gameMap.getTile({ x: 1, y: 2 })).toEqual({ position: { x: 1, y: 2 }, type: "WALL" });
    });

    it("should serialize the map correctly", () => {
        const gameMap = GameMap.fromArray(SIMPLE_MAP);

        expect(gameMap.serialize()).toEqual({ tiles: SIMPLE_MAP, depots: [] });
    });
});