import path from "path";
import { Colony } from "./colonies/colony";
import { logger } from "../logger";
import { timeoutAfter } from "../utils";
import { ColonyError } from "./error";
import { Command, Tick } from "./types";
import { GameMap } from "./map";

export interface GameOptions {
    map: GameMap,
    numberOfTicks: number,
    timeMsAllowedPerTicks: number,
    maxWaitTimeMsBeforeStartingGame: number,
    expectedNumberOfColonies: number
}

export class Game {
    public static readonly DEFAULT_GAME_OPTIONS: GameOptions = {
        map: null,
        numberOfTicks: 5,
        timeMsAllowedPerTicks: 1000,
        maxWaitTimeMsBeforeStartingGame: 0,
        expectedNumberOfColonies: 3
    }

    public map: GameMap;

    private callbackOnGameCompleted: ((err?: Error) => any)[] = [];
    private callbackOnTick: (() => any)[] = [];
    private callbackOnCommand: (() => any)[] = [];
    private _isRunning = false;
    private _isCompleted = false;
    private _currentTick: number = 0;
    private maxWaitTimeInterval: NodeJS.Timeout;

    public readonly colonies: Colony[] = [];

    constructor(private options?: Partial<GameOptions>) {
        this.options = {
            ...Game.DEFAULT_GAME_OPTIONS,
            ...options
        }

        this.map = this.options.map;

        if (this.options.maxWaitTimeMsBeforeStartingGame !== 0) {
            logger.info(`The game will start automatically after ${this.options.maxWaitTimeMsBeforeStartingGame} ms or when ${this.options.expectedNumberOfColonies} colonies will have joined, whichever come first.`);

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
            throw new ColonyError(colony, `Game already running of completed, can't add Colony`);
        }

        if (this.colonies.indexOf(colony) !== -1) {
            throw new ColonyError(colony, `Colony already registed.`);
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

    private notifyCommandApplied() {
        this.callbackOnCommand.forEach(cb => cb());
    }

    private notifyTickApplied() {
        this.callbackOnTick.forEach(cb => cb());
    }

    public getColony(colonyId: string) {
        return this.colonies.find(c => c.id === colonyId);
    }

    public getUnit(unitId: string) {
        return this.colonies.flatMap(c => c.getUnit(unitId))[0];
    }

    public onGameCompleted(cb: (err?: Error) => any) {
        this.callbackOnGameCompleted.push(cb);
    }

    public onTick(cb: () => any) {
        this.callbackOnTick.push(cb);
    }

    public onCommand(cb: () => any) {
        this.callbackOnCommand.push(cb);
    }

    get isRunning(): boolean {
        return this._isRunning
    }

    get isCompleted(): boolean {
        return this._isCompleted;
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
            this._currentTick = tick;
            logger.info(`Playing tick ${tick} of ${this.options.numberOfTicks}`);
            const startingState = this.serialize();

            const allTickCommandsWaiting = this.colonies.map(async c => {
                try {
                    let command: Command | void = null;

                    if (this.options.timeMsAllowedPerTicks !== 0) {
                        command = await Promise.race([
                            timeoutAfter(this.options.timeMsAllowedPerTicks),
                            c.getNextCommand({ colonyId: c.id, ...startingState })
                        ]);
                    } else {
                        command = await c.getNextCommand({ colonyId: c.id, ...this.serialize() });
                    }

                    if (command) {
                        c.applyCommand(command);
                        this.notifyCommandApplied();
                    } else {
                        logger.info(`No command was received in time for ${c} on tick ${tick}`);
                    }
                } catch (ex) {
                    logger.warn(`Error while fetching ${c} command for tick ${tick}.`, ex);
                }
            });

            try {
                await Promise.allSettled(allTickCommandsWaiting)
                this.notifyTickApplied();
            } catch (ex) {
                logger.error(`An unhandled error occured`, ex);

                this._isRunning = false;
                this.notifyGameCompleted(ex);

                throw ex;
            }
        }
        this._currentTick++;

        this._isCompleted = true;
        this._isRunning = false;

        this.notifyGameCompleted();
    };

    public serialize(): Tick {
        return {
            colonies: this.colonies.map(c => c.serialize()),
            tick: this._currentTick,
            totalTick: this.options.numberOfTicks,
            map: this.map?.serialize?.() ?? {tiles: []}
        }
    }
}