import { roundRobin, timeoutAfter } from "../src/utils";
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
});