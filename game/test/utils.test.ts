import { timeoutAfter } from "../src/utils";
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
});