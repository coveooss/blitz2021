import { Colony } from "../src/game/colonies/colony";
import { NoopColony } from "../src/game/colonies/noopColony";
import { UNIT } from "../src/game/config";
import { Game } from "../src/game/game";
import { GameMap } from "../src/game/map";
import { Miner } from "../src/game/units/miner";
import { Unit } from "../src/game/units/unit";

describe("Miner", () => {
    let game: Game;
    let myColony: Colony;
    let unit: Unit;
    let map: GameMap;

    beforeEach(() => {
        map = GameMap.fromArray([['EMPTY', 'EMPTY', 'EMPTY', 'WALL', 'EMPTY']]);
        game = new Game({ map });
        myColony = new NoopColony(game);
        unit = new Miner(myColony, { x: 0, y: 0 });
    });

    describe('move', () => {

        it('should throw if cargo is too large', () => {
            unit.cargo = UNIT.MAX_MINER_MOVE_CARGO + 1;

            expect(() => unit.move({ x: 0, y: 2 })).toThrowError();
        });

        it('should move to the position', () => {
            expect(unit.position).toEqual({ x: 0, y: 0 });

            unit.move({ x: 0, y: 2 });

            expect(unit.position).toEqual({ x: 0, y: 1 });
            expect(unit.path).toEqual([{ x: 0, y: 2 }]);
        });
    })
});