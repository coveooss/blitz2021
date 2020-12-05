import { Colony } from "../src/game/colonies/colony";
import { NoopColony } from "../src/game/colonies/noopColony";
import { Game } from "../src/game/game";
import { GameMap } from "../src/game/map";
import { Unit } from "../src/game/units/unit";


class TestUnit extends Unit { };

describe('Unit', () => {
    let game: Game;
    let myColony: Colony;
    let unit: Unit;
    let map: GameMap;

    describe('move', () => {
        beforeEach(() => {
            map = GameMap.fromArray([['EMPTY', 'EMPTY', 'EMPTY', 'WALL', 'EMPTY']]);
            game = new Game({ map });
            myColony = new NoopColony(game);
            unit = new TestUnit(myColony, { x: 0, y: 0 }, 'MINER');
        });
        it('should throw if there is not path possble', () => {
            expect(() => unit.move({ x: 0, y: 4 })).toThrowError();
        });
        it('should move to the first node of the path towards the target', () => {
            expect(unit.position).toEqual({ x: 0, y: 0 });

            unit.move({ x: 0, y: 2 });

            expect(unit.position).toEqual({ x: 0, y: 1 });
            expect(unit.path).toEqual([{ x: 0, y: 2 }]);
        });

        it('should stay in place if the target is the current position', () => {
            expect(unit.position).toEqual({ x: 0, y: 0 });

            unit.move({ x: 0, y: 0 });

            expect(unit.position).toEqual({ x: 0, y: 0 });
            expect(unit.path).toEqual([]);
        });
    });

    describe('attack', () => {
        it.todo('should kill the target');
        it.todo('should throw if target is not adjacent');
    });

    describe('pick up', () => {
        it.todo('should pick up the blitzium from the target');
        it.todo('should throw if target is not adjacent');
        it.todo('should throw if the unit is full');
        it.todo('should only pick up the amount to fill its cargo');
    })
});