import { Game } from "../src/game/game";
import { NoopCrew } from "../src/game/crews/noopCrew";
import { UNIT } from "../src/game/config";

jest.useFakeTimers('legacy');

describe("Game", () => {
    const NUMBER_OF_TICKS = 5;
    const MAX_WAIT_TIME_BEFORE_STARTING = 1000;
    const EXPECTED_NUMBER_OF_CREWS = 3;

    let game: Game;

    beforeEach(() => {
        game = new Game({
            numberOfTicks: NUMBER_OF_TICKS,
            expectedNumberOfCrews: EXPECTED_NUMBER_OF_CREWS,
            maxWaitTimeMsBeforeStartingGame: MAX_WAIT_TIME_BEFORE_STARTING
        });
    })
    it.todo("should apply the received command to the proper crew");
    it.todo("should not applied the received command if the crew was too slow");

    it("should ask the crews for their commands on each tick", async () => {
        const myFirstCrew = new NoopCrew(game);
        const mySecondCrew = new NoopCrew(game);

        myFirstCrew.getNextCommand = jest.fn(() => Promise.resolve({}));
        mySecondCrew.getNextCommand = jest.fn(() => Promise.resolve({}));

        await game.play();

        expect(myFirstCrew.getNextCommand).toHaveBeenCalledTimes(NUMBER_OF_TICKS);
        expect(mySecondCrew.getNextCommand).toHaveBeenCalledTimes(NUMBER_OF_TICKS);
    });
    it('should start the game after the max wait time', async () => {
        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);

        new NoopCrew(game);
        new NoopCrew(game);

        jest.advanceTimersByTime(MAX_WAIT_TIME_BEFORE_STARTING - 1);

        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);

        jest.advanceTimersByTime(1);

        expect(game.isRunning).toBe(true);
        expect(game.isCompleted).toBe(false);
    });

    it('should not start the game after the max wait time if there is no crews', async () => {
        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);

        jest.advanceTimersByTime(MAX_WAIT_TIME_BEFORE_STARTING - 1);

        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);

        jest.advanceTimersByTime(1);

        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);
    });

    it("should start the game when the expected numbers of crews have joined", () => {
        for (let i = 0; i < EXPECTED_NUMBER_OF_CREWS - 1; i++) {
            new NoopCrew(game);
        }

        jest.runAllImmediates();
        expect(game.crews.length).toBe(EXPECTED_NUMBER_OF_CREWS - 1);
        expect(game.isRunning).toBe(false);

        new NoopCrew(game);

        jest.runAllImmediates();
        expect(game.crews.length).toBe(EXPECTED_NUMBER_OF_CREWS);
        expect(game.isRunning).toBe(true);
    });

    it('should notify handlers when the game is completed', async () => {
        const firstOnGameCompleted = jest.fn();
        const secondOnGameCompleted = jest.fn();

        game.onGameCompleted(firstOnGameCompleted);
        game.onGameCompleted(secondOnGameCompleted);


        expect(game.isCompleted).toBe(false);
        expect(firstOnGameCompleted).not.toHaveBeenCalled();
        expect(secondOnGameCompleted).not.toHaveBeenCalled();

        new NoopCrew(game);
        await game.play();

        expect(firstOnGameCompleted).toHaveBeenCalledTimes(1);
        expect(secondOnGameCompleted).toHaveBeenCalledTimes(1);
    });

    it('should notify tick handlers when a tick occur', async () => {
        const firstOnTick = jest.fn();
        const secondOnTick = jest.fn();

        game.onTick(firstOnTick);
        game.onTick(secondOnTick);


        expect(firstOnTick).not.toHaveBeenCalled();
        expect(secondOnTick).not.toHaveBeenCalled();

        new NoopCrew(game);
        await game.play();

        expect(firstOnTick).toHaveBeenCalledTimes(NUMBER_OF_TICKS);
        expect(secondOnTick).toHaveBeenCalledTimes(NUMBER_OF_TICKS);
    });

    it('should notify command handlers when a command occur', async () => {
        const firstOnCommand = jest.fn();
        const secondOnCommand = jest.fn();

        game.onCommand(firstOnCommand);
        game.onCommand(secondOnCommand);


        expect(firstOnCommand).not.toHaveBeenCalled();
        expect(secondOnCommand).not.toHaveBeenCalled();

        new NoopCrew(game);
        new NoopCrew(game);
        new NoopCrew(game);

        await game.play();

        expect(firstOnCommand).toHaveBeenCalledTimes(NUMBER_OF_TICKS * 3);
        expect(secondOnCommand).toHaveBeenCalledTimes(NUMBER_OF_TICKS * 3);
    });

    describe('serialize', () => {
        it('serialize its state', () => {
            expect(game.serialize()).toStrictEqual({
                crews: [],
                tick: 0,
                totalTick: NUMBER_OF_TICKS,
                map: { tiles: expect.any(Array), depots: [] },
                rules: {
                    MAX_MINER_CARGO: UNIT.MAX_MINER_CARGO,
                    MAX_CART_CARGO: UNIT.MAX_CART_CARGO,
                    MAX_MINER_MOVE_CARGO: UNIT.MAX_MINER_MOVE_CARGO
                }
            });
        });

        it('serialize its crews', async () => {
            new NoopCrew(game);
            new NoopCrew(game);
            new NoopCrew(game);

            expect(game.serialize()).toStrictEqual({
                crews: [expect.any(Object), expect.any(Object), expect.any(Object)],
                tick: 0,
                totalTick: NUMBER_OF_TICKS,
                map: { tiles: expect.any(Array), depots: [] },
                rules: {
                    MAX_MINER_CARGO: UNIT.MAX_MINER_CARGO,
                    MAX_CART_CARGO: UNIT.MAX_CART_CARGO,
                    MAX_MINER_MOVE_CARGO: UNIT.MAX_MINER_MOVE_CARGO
                }
            });
        });

        it('serialize its tick value', async () => {
            new NoopCrew(game);

            await game.play();

            expect(game.serialize()).toStrictEqual({
                crews: [expect.any(Object)],
                tick: NUMBER_OF_TICKS,
                totalTick: NUMBER_OF_TICKS,
                map: { tiles: expect.any(Array), depots: [] },
                rules: {
                    MAX_MINER_CARGO: UNIT.MAX_MINER_CARGO,
                    MAX_CART_CARGO: UNIT.MAX_CART_CARGO,
                    MAX_MINER_MOVE_CARGO: UNIT.MAX_MINER_MOVE_CARGO
                }
            });
        });
    });
})