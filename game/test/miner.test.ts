import { Crew } from "../src/game/crews/crew";
import { NoopCrew } from "../src/game/crews/noopCrew";
import { UNIT } from "../src/game/config";
import { Game } from "../src/game/game";
import { GameMap } from "../src/game/map";
import { Miner } from "../src/game/units/miner";
import { Unit } from "../src/game/units/unit";

describe("Miner", () => {
    let game: Game;
    let myCrew: Crew;
    let unit: Unit;
    let map: GameMap;

    beforeEach(() => {
        map = GameMap.fromArray([['EMPTY', 'EMPTY', 'EMPTY', 'WALL', 'EMPTY']]);

        game = new Game();
        game.map = map;

        myCrew = new NoopCrew(game);
        unit = new Miner(myCrew, { x: 0, y: 0 });
    });

    describe('move', () => {

        it('should throw if cargo is too large', () => {
            unit.blitzium = UNIT.MAX_MINER_MOVE_CARGO + 1;

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