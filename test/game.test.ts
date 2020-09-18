import { Game } from "../src/game/game";
import { NoopColony } from "../src/game/colonies/noopColony";
import { waitForPromiseResolution } from "./testUtils";

jest.useFakeTimers('legacy');

describe("Game", () => {
    const NUMBER_OF_TICKS = 5;
    const MAX_WAIT_TIME_BEFORE_STARTING = 1000;
    const EXPECTED_NUMBER_OF_COLONIES = 3;

    let game: Game;

    beforeEach(() => {
        game = new Game({
            numberOfTicks: NUMBER_OF_TICKS,
            expectedNumberOfColonies: EXPECTED_NUMBER_OF_COLONIES,
            maxWaitTimeMsBeforeStartingGame: MAX_WAIT_TIME_BEFORE_STARTING
        });
    })
    it.todo("should apply the received command to the proper colony");
    it.todo("should not applied the received command if the colony was too slow");

    it("should ask the colonies for their commands on each tick", async () => {
        const myFirstColony = new NoopColony(game);
        const mySecondColony = new NoopColony(game);

        myFirstColony.getNextCommand = jest.fn(() => Promise.resolve({}));
        mySecondColony.getNextCommand = jest.fn(() => Promise.resolve({}));

        await game.play();

        expect(myFirstColony.getNextCommand).toHaveBeenCalledTimes(NUMBER_OF_TICKS);
        expect(mySecondColony.getNextCommand).toHaveBeenCalledTimes(NUMBER_OF_TICKS);
    });
    it('should start the game after the max wait time', async () => {
        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);

        new NoopColony(game);
        new NoopColony(game);

        jest.advanceTimersByTime(MAX_WAIT_TIME_BEFORE_STARTING - 1);

        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);

        jest.advanceTimersByTime(1);

        expect(game.isRunning).toBe(true);
        expect(game.isCompleted).toBe(false);
    });

    it('should not start the game after the max wait time if there is no colonies', async () => {
        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);

        jest.advanceTimersByTime(MAX_WAIT_TIME_BEFORE_STARTING - 1);

        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);

        jest.advanceTimersByTime(1);

        expect(game.isRunning).toBe(false);
        expect(game.isCompleted).toBe(false);
    });

    it("should start the game when the expected numbers of colonies have joined", () => {
        for (let i = 0; i < EXPECTED_NUMBER_OF_COLONIES - 1; i++) {
            new NoopColony(game);
        }

        jest.runAllImmediates();
        expect(game.colonies.length).toBe(EXPECTED_NUMBER_OF_COLONIES - 1);
        expect(game.isRunning).toBe(false);

        new NoopColony(game); 

        jest.runAllImmediates();
        expect(game.colonies.length).toBe(EXPECTED_NUMBER_OF_COLONIES);
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

        new NoopColony(game);
        await game.play();

        expect(firstOnGameCompleted).toHaveBeenCalledTimes(1);
        expect(secondOnGameCompleted).toHaveBeenCalledTimes(1);
    });
})