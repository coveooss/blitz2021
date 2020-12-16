import { Colony } from "../src/game/colonies/colony";
import { NoopColony } from "../src/game/colonies/noopColony";
import { Game } from "../src/game/game";
import { GameMap, Tile } from "../src/game/map";
import { Unit } from "../src/game/units/unit";

jest.mock('uuid', () => ({
    v4: () => 'test-id'
}));

class TestUnit extends Unit { }

describe('Unit', () => {
    let game: Game;
    let myColony: Colony;
    let unit: Unit;
    let map: GameMap;

    beforeEach(() => {
        map = GameMap.fromArray([['EMPTY', 'EMPTY', 'EMPTY', 'WALL', 'EMPTY']]);
        game = new Game({ map });
        myColony = new NoopColony(game);
        unit = new TestUnit(myColony, { x: 0, y: 0 }, 'MINER');
    });

    describe('move', () => {
        it('should throw if there is not path possble', () => {
            expect(() => unit.move({ x: 0, y: 4 })).toThrowError();
        });
        it('should move to the first node of the path towards the target', () => {
            expect(unit.position).toEqual({ x: 0, y: 0 });

            unit.move({ x: 0, y: 2 });

            expect(unit.position).toEqual({ x: 0, y: 1 });
            expect(unit.path).toEqual([{ x: 0, y: 2 }]);
        });

        it('should use the precalculated path towards the target on next move', () => {
            expect(unit.position).toEqual({ x: 0, y: 0 });

            unit.move({ x: 0, y: 2 });

            expect(unit.position).toEqual({ x: 0, y: 1 });
            expect(unit.path).toEqual([{ x: 0, y: 2 }]);

            unit.move({ x: 0, y: 2 });

            expect(unit.position).toEqual({ x: 0, y: 2 });
            expect(unit.path).toEqual([]);
        });

        it('should move to the target if adjacent node', () => {
            expect(unit.position).toEqual({ x: 0, y: 0 });

            unit.move({ x: 0, y: 1 });

            expect(unit.position).toEqual({ x: 0, y: 1 });
            expect(unit.path).toEqual([]);
        });

        it('should stay in place if the target is the current position', () => {
            expect(unit.position).toEqual({ x: 0, y: 0 });

            unit.move({ x: 0, y: 0 });

            expect(unit.position).toEqual({ x: 0, y: 0 });
            expect(unit.path).toEqual([]);
        });
    });

    describe('attack', () => {
        let enemyColony: Colony;
        let enemyUnit: Unit;

        beforeEach(() => {
            enemyColony = new NoopColony(game);
            enemyUnit = new TestUnit(enemyColony, { x: 0, y: 1 }, 'MINER');
        });
        it('should kill the target', () => {
            expect(enemyColony.units).toContainEqual(enemyUnit);

            unit.attack(enemyUnit.position);

            expect(enemyColony.units).not.toContainEqual(enemyUnit);
        });
        it('should throw if target is not adjacent', () => {
            enemyUnit.position = { x: 0, y: 2 };
            expect(() => unit.attack(enemyUnit.position)).toThrowError();
        });

        it('should throw if the target is friendly', () => {
            let friendlyUnit = new TestUnit(myColony, { x: 1, y: 0 }, 'MINER');

            expect(() => unit.attack(friendlyUnit.position)).toThrowError();
        });
    });

    describe('mine', () => {
        let mine: Tile;

        beforeEach(() => {
            mine = { type: 'MINE', position: { x: 0, y: 1 } };
            map.mines = [mine];

            unit.maxBlitzium = 50;
        });

        it('should mine 1 blitzium from the mine', () => {
            expect(unit.blitzium).toBe(0);

            unit.mine(mine.position);

            expect(unit.blitzium).toBe(1);
        });

        it('should not mine if cargo is already full', () => {
            unit.blitzium = 50;
            expect(() => unit.mine(mine.position)).toThrowError();
        });

        it('should throw if there is no mine nearby', () => {
            mine.position = { x: 0, y: 2 };
            expect(() => unit.mine(mine.position)).toThrowError();
        });
    });

    describe('pickup', () => {
        it.todo('should pick up the blitzium from the target if they are allied');
        it.todo('should throw if target is not adjacent');
        it.todo('should throw if the unit is full');
        it.todo('should only pick up the amount to fill its cargo');
    })

    describe('serialize', () => {
        it('should serialize its state', () => {
            unit = new TestUnit(myColony, { x: 4, y: 3 }, 'MINER');

            expect(unit.serialize()).toStrictEqual({
                id: 'test-id',
                type: 'MINER',
                path: [],
                blitzium: 0,
                position: { x: 4, y: 3 }
            });
        });
    });
});