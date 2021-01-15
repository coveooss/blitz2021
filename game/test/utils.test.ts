import { Crew } from "../src/game/crews/crew";
import { NoopCrew } from "../src/game/crews/noopCrew";
import { CrewStats, Game } from "../src/game/game";
import { roundRobin, sortRankCrews, timeoutAfter } from "../src/utils";
import { waitForPromiseResolution } from "./testUtils";

describe("Utils", () => {
    describe("timeoutAfter", () => {

        const DEFAULT_TIMEOUT_VALUE = 1000;
        jest.useFakeTimers('legacy');

        it("should only resolve after the specified timeout value", async () => {
            const myTimeout = timeoutAfter(DEFAULT_TIMEOUT_VALUE);
            const onResolve = jest.fn();

            myTimeout.then(onResolve);

            expect(onResolve).not.toHaveBeenCalled();

            jest.advanceTimersByTime(DEFAULT_TIMEOUT_VALUE - 1);
            await waitForPromiseResolution();

            expect(onResolve).not.toHaveBeenCalled();

            jest.advanceTimersByTime(1);
            await waitForPromiseResolution();

            expect(onResolve).toHaveBeenCalled();
        });
    });


    describe('roundRobin', () => {
        it('should round robin the array (duh)', () => {
            let myArray = [1, 2, 3, 4, 5];

            expect(roundRobin(myArray, 0)).toEqual([1, 2, 3, 4, 5]);
            expect(roundRobin(myArray, 1)).toEqual([2, 3, 4, 5, 1]);
            expect(roundRobin(myArray, 2)).toEqual([3, 4, 5, 1, 2]);
            expect(roundRobin(myArray, 3)).toEqual([4, 5, 1, 2, 3]);
            expect(roundRobin(myArray, 4)).toEqual([5, 1, 2, 3, 4]);
            expect(roundRobin(myArray, 5)).toEqual([1, 2, 3, 4, 5]);
        });
    });

    describe('sort rank', () => {
        let game: Game;
        let stats: Map<Crew, CrewStats>;
        let crews: Crew[];

        beforeEach(() => {
            game = new Game();
            stats = new Map();

            crews = [
                new NoopCrew(game),
                new NoopCrew(game),
                new NoopCrew(game)
            ];

            crews[1].name = 'FIRST';
            crews[2].name = 'SECOND';
            crews[0].name = 'LAST';

            crews.forEach(c => {
                stats.set(c, {
                    nbTimeouts: 0,
                    processingTimePerTicks: [0],
                    responseTimePerTicks: [0],
                    unitsPerTicks: [0]
                })
            });
        })
        it('shoud sort by blitzium first', () => {
            crews[0].blitzium = 10;
            crews[1].blitzium = 50;
            crews[2].blitzium = 25;

            crews[0].totalBlitzium = 10;
            crews[1].totalBlitzium = 20;
            crews[2].totalBlitzium = 30;

            stats.get(crews[0]).responseTimePerTicks = [100];
            stats.get(crews[1]).responseTimePerTicks = [200];
            stats.get(crews[2]).responseTimePerTicks = [300];

            const rankedArray = crews.sort((a, b) => sortRankCrews(a, b, stats));

            expect(rankedArray[0].name).toBe('FIRST');
            expect(rankedArray[1].name).toBe('SECOND');
            expect(rankedArray[2].name).toBe('LAST');
        });

        it('shoud sort by total blitzium second', () => {
            crews[0].blitzium = 10;
            crews[1].blitzium = 10;
            crews[2].blitzium = 10;

            crews[0].totalBlitzium = 10;
            crews[1].totalBlitzium = 50;
            crews[2].totalBlitzium = 25;

            stats.get(crews[0]).responseTimePerTicks = [100];
            stats.get(crews[1]).responseTimePerTicks = [200];
            stats.get(crews[2]).responseTimePerTicks = [300];

            const rankedArray = crews.sort((a, b) => sortRankCrews(a, b, stats));

            expect(rankedArray[0].name).toBe('FIRST');
            expect(rankedArray[1].name).toBe('SECOND');
            expect(rankedArray[2].name).toBe('LAST');
        });

        it('shoud sort by response time last', () => {
            crews[0].blitzium = 10;
            crews[1].blitzium = 10;
            crews[2].blitzium = 10;

            crews[0].totalBlitzium = 10;
            crews[1].totalBlitzium = 10;
            crews[2].totalBlitzium = 10;

            stats.get(crews[0]).responseTimePerTicks = [500];
            stats.get(crews[1]).responseTimePerTicks = [100];
            stats.get(crews[2]).responseTimePerTicks = [250];

            const rankedArray = crews.sort((a, b) => sortRankCrews(a, b, stats));

            expect(rankedArray[0].name).toBe('FIRST');
            expect(rankedArray[1].name).toBe('SECOND');
            expect(rankedArray[2].name).toBe('LAST');
        });

    })
});