import { Game } from '../src/game/game';
import { Colony } from '../src/game/colonies/colony';
import { Command, PlayerTick } from '../src/game/types';

const EXPECTED_COLONY_ID = 'test-id';
const EXPECTED_COLONY_NAME = 'test-name';

jest.mock('../src/game/game');
jest.mock('uuid',() => ({
    v4: () => EXPECTED_COLONY_ID
}));

class TestColony extends Colony {
    constructor(public game: Game) {
        super(game, EXPECTED_COLONY_NAME);

        this.spawnPoint = { x: 12, y: 24 };
        this.homeBase = { x: 11, y: 24 };
    }

    async getNextCommand(tick: PlayerTick): Promise<Command> {
        return Promise.reject();
    }
}

describe('Colony', () => {
    describe('buy unit', () => {
        it.todo('should throw if there is not enough blitzium available');
        it.todo('should add the unit to the colony with the proper cost');
    });

    describe('apply command', () => {
        it.todo('should send the move command to the proper unit');
        it.todo('should send the attack command to the proper unit');
        it.todo('should send the pickup command to the proper unit');
        it.todo('should allow only one buy command per tick');
    });

    describe('serialize', () => {
        it('should serialize its default state', () => {
            const colony = new TestColony(new Game());

            expect(colony.serialize()).toStrictEqual({
                id: EXPECTED_COLONY_ID,
                name: EXPECTED_COLONY_NAME,
                errors: [],
                homeBase: { x: 11, y: 24 },
                spawnPoint: { x: 12, y: 24 },
                blitzium: 0,
                units: [],
            });
        });

        it.todo('serialize units');
        it.todo('serialize errors');
        it.todo('serialize the correct amount of blitzium');
    });
});