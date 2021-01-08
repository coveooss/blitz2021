import fs from 'fs';
import { Recorder, RecorderMode } from '../src/recorder/recorder';
import { Game } from '../src/game/game';
import { NoopColony } from '../src/game/colonies/noopColony';
import { Tick } from '../src/game/types';

jest.mock('fs');
jest.useFakeTimers('legacy');

const NUMBER_OF_TICKS = 5;
const NUMBER_OF_COLONIES = 2;

describe("Recorder", () => {
    let game: Game;

    const givenTwoColonies = () => {
        return new Promise((resolve) => {
            const myFirstColony = new NoopColony(game);
            const mySecondColony = new NoopColony(game);

            myFirstColony.getNextCommand = jest.fn(() => Promise.resolve({}));
            mySecondColony.getNextCommand = jest.fn(() => Promise.resolve({}));

            setImmediate(() => resolve());
        });
    };

    describe('RecorderMode.Command', () => {
        it('should serialize the game for all received command', async () => {
            game = new Game({
                numberOfTicks: NUMBER_OF_TICKS,
                expectedNumberOfColonies: NUMBER_OF_COLONIES,
                maxWaitTimeMsBeforeStartingGame: 0
            });
            game.serialize = jest.fn();
            new Recorder(game, RecorderMode.Command);

            await givenTwoColonies();

            // The game serialize itself once per tick to send to all players
            // The recorder serialize the game once per command (tick * colonies)
            expect(game.serialize).toHaveBeenCalledTimes(NUMBER_OF_TICKS * NUMBER_OF_COLONIES + NUMBER_OF_TICKS);
        });

        it('should append to the buffer for all received command', async () => {
            game = new Game({
                numberOfTicks: NUMBER_OF_TICKS,
                expectedNumberOfColonies: NUMBER_OF_COLONIES,
                maxWaitTimeMsBeforeStartingGame: 0
            });
            const recorder = new Recorder(game, RecorderMode.Command);

            await givenTwoColonies();

            expect(recorder.buffer.length).toBe(NUMBER_OF_TICKS * NUMBER_OF_COLONIES);
        });
    });

    describe('RecorderMode.Tick', () => {
        it('should serialize the game for every tick', async () => {
            const serializeSpy = jest.spyOn(Game.prototype, 'serialize').mockReturnValue({} as Tick);
            game = new Game({
                numberOfTicks: NUMBER_OF_TICKS,
                expectedNumberOfColonies: NUMBER_OF_COLONIES,
                maxWaitTimeMsBeforeStartingGame: 0
            });
            new Recorder(game, RecorderMode.Tick);

            await givenTwoColonies();

            // The game serialize itself once per tick to send to all players
            // The recorder serialize the game once per tick
            expect(serializeSpy).toHaveBeenCalledTimes(NUMBER_OF_TICKS + NUMBER_OF_TICKS);
        });

        it('should modify the buffer for every tick', async () => {
            game = new Game({
                numberOfTicks: NUMBER_OF_TICKS,
                expectedNumberOfColonies: NUMBER_OF_COLONIES,
                maxWaitTimeMsBeforeStartingGame: 0
            });
            const recorder = new Recorder(game, RecorderMode.Tick);

            givenTwoColonies();

            await game.play();

            expect(recorder.buffer.length).toBe(NUMBER_OF_TICKS);
        });
    });

    describe('saveToFile', () => {
        let recorder: Recorder;

        beforeEach(() => {
            recorder = new Recorder(new Game(), RecorderMode.Command);
        });

        it('should save an object to a file', () => {
            recorder.saveToFile('path/to/file');

            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        });

        it('should save on the expected path', () => {
            recorder.saveToFile('path/to/file');

            expect(fs.writeFileSync).toHaveBeenCalledWith('path/to/file', "[]");
        });

        it('should stringify the object', () => {
            recorder.buffer = [{ colonies: [], map: { tiles: [[]], depots: [] }, tick: 0, totalTick: 10, rules: { MAX_MINER_CARGO: 0, MAX_MINER_MOVE_CARGO: 0, MAX_CART_CARGO: 0 } }];
            recorder.saveToFile('path/to/file');

            expect(fs.writeFileSync).toHaveBeenCalledWith('path/to/file', JSON.stringify(recorder.buffer, null, 2));
        });
    });
});
