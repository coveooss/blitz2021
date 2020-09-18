import { Colony } from "./colonies/colony";
import { logger } from "../logger";
import { timeoutAfter } from "../utils";

export interface GameOptions {
    numberOfTicks: number,
    timeMsAllowedPerTicks: number,
    maxWaitTimeMsBeforeStartingGame: number,
    expectedNumberOfColonies: number
}

export class Game {
    public static readonly DEFAULT_GAME_OPTIONS: GameOptions = {
        numberOfTicks: 5,
        timeMsAllowedPerTicks: 1000,
        maxWaitTimeMsBeforeStartingGame: 0,
        expectedNumberOfColonies: 3
    }

    private callbackOnGameCompleted: ((err?: Error) => any)[] = []
    private _isRunning = false;
    private _isCompleted = false;
    private maxWaitTimeInterval: NodeJS.Timeout;

    public readonly colonies: Colony[] = [];

    constructor(private options?: Partial<GameOptions>) {
        this.options = {
            ...Game.DEFAULT_GAME_OPTIONS,
            ...options
        }


        if (this.options.maxWaitTimeMsBeforeStartingGame !== 0) {
            logger.info(`The game will start automaticly after ${this.options.maxWaitTimeMsBeforeStartingGame} ms or when ${this.options.expectedNumberOfColonies} colonies will have joined, whichever come first.`);

            this.maxWaitTimeInterval = setTimeout(() => {
                if (!this.isRunning && !this.isCompleted) {
                    if (this.colonies.length === 0) {
                        this.notifyGameCompleted(new Error(`Max wait time for the game to start of ${this.options.maxWaitTimeMsBeforeStartingGame} ms exceeded but no colonies were registered.`));
                    } else {
                        logger.info(`Starting the game automaticly after waiting for ${this.options.maxWaitTimeMsBeforeStartingGame} ms with ${this.colonies.length} colonies.`);

                        this.play();
                    }
                }
            }, this.options.maxWaitTimeMsBeforeStartingGame);

        } else if (this.options.expectedNumberOfColonies) {
            logger.info(`The game will start as soon as ${this.options.expectedNumberOfColonies} colony(ies) will join.`);
        }

    }

    public registerColony(colony: Colony) {
        if (this.isRunning || this.isCompleted) {
            throw new Error(`Game already running of completed, can't add ${colony}`);
        }

        if (this.colonies.indexOf(colony) !== -1) {
            throw new Error(`Colony ${colony} already registed.`);
        }

        logger.info(`Registering new ${colony} to the game.`);
        this.colonies.push(colony);

        if (this.colonies.length === this.options.expectedNumberOfColonies) {
            setImmediate(() => {
                logger.info(`Number of expected colonies (${this.options.expectedNumberOfColonies}) reached, starting the game.`);
                this.play();
            });
        }
    }

    private notifyGameCompleted(err?: Error) {
        this.callbackOnGameCompleted.forEach(cb => cb(err));
    }


    public onGameCompleted(cb: (err?: Error) => any) {
        this.callbackOnGameCompleted.push(cb);
    }

    get isRunning(): boolean {
        return this._isRunning
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    public applyCommandForColony(colony: Colony, command: any) {
        // TO DO: Insert game logic here
    }


    public async play() {
        if (this.maxWaitTimeInterval) {
            clearTimeout(this.maxWaitTimeInterval);
        }

        if (this.isRunning) {
            throw new Error(`Game is already running.`);
        }

        this._isRunning = true;

        for (let tick = 0; tick < this.options.numberOfTicks; tick++) {
            logger.info(`Playing tick ${tick} of ${this.options.numberOfTicks}`);

            const allTickCommandsWaiting = this.colonies.map(async c => {
                try {
                    let command = null;

                    if (this.options.timeMsAllowedPerTicks !== 0) {
                        command = await Promise.race([
                            timeoutAfter(this.options.timeMsAllowedPerTicks),
                            c.getNextCommand({ tick })
                        ]);
                    } else {
                        command = await c.getNextCommand({ tick });
                    }

                    if (command) {
                        this.applyCommandForColony(c, command);
                    } else {
                        logger.info(`No command was received in time for ${c} on tick ${tick}`);
                    }
                } catch (ex) {
                    logger.warn(`Error while fetching ${c} command for tick ${tick}.`, ex);
                }
            });

            try {
                await Promise.allSettled(allTickCommandsWaiting)
            } catch (ex) {
                logger.error(`An unhandled error occured`, ex);

                this._isRunning = false;
                this.notifyGameCompleted(ex);

                throw ex;
            }
        }

        this._isCompleted = true;
        this._isRunning = false;

        this.notifyGameCompleted();
    };
}