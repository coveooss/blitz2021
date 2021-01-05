import { Colony } from "./colonies/colony";
import { logger } from "../logger";
import { hny, timeoutAfter } from "../utils";
import { ColonyError } from "./error";
import { Command, Tick } from "./types";
import { GameMap, Path } from "./map";
import { distanceBetween, hash, Position } from './position'
import { Miner } from "./units/miner";
import { Viewer } from "./viewer";
import { COLONY } from "./config";
import { Unit } from "./units/unit";
import aStar from "a-star";

export interface GameOptions {
    gameMapFile: string,
    numberOfTicks: number,
    timeMsAllowedPerTicks: number,
    maxWaitTimeMsBeforeStartingGame: number,
    expectedNumberOfColonies: number
}

export interface GameResult {
    teamName: string,
    rank: number,
    score: number
}

export interface ColonyStats {
    responseTimePerTicks: number[],
    processingTimePerTicks: number[],
    unitsPerTicks: number[],
    nbTimeouts: number,
}

export class Game {
    public static readonly DEFAULT_GAME_OPTIONS: GameOptions = {
        gameMapFile: '',
        numberOfTicks: 5,
        timeMsAllowedPerTicks: 0,
        maxWaitTimeMsBeforeStartingGame: 0,
        expectedNumberOfColonies: 3
    }

    public map: GameMap;

    private callbackOnGameCompleted: ((gameResults: GameResult[], err?: Error) => any)[] = [];
    private callbackOnTick: (() => any)[] = [];
    private callbackOnCommand: (() => any)[] = [];
    private _isRunning = false;
    private _isCompleted = false;
    private _currentTick: number = 0;
    private maxWaitTimeInterval: NodeJS.Timeout;

    public readonly colonies: Colony[] = [];
    public readonly viewers: Viewer[] = [];

    public readonly responseTimePerColony: Map<Colony, ColonyStats>;

    constructor(private options?: Partial<GameOptions>) {

        this.options = {
            ...Game.DEFAULT_GAME_OPTIONS,
            ...options
        }

        this.responseTimePerColony = new Map<Colony, ColonyStats>();

        if (!this.options.gameMapFile || this.options.gameMapFile === "") {
            logger.info(`Using the default map`);
            this.map = GameMap.empty(50);
        } else {
            logger.info(`Using ${this.options.gameMapFile}`);
            this.map = GameMap.fromFile(this.options.gameMapFile);
        }

        if (this.options.expectedNumberOfColonies === undefined) {
            this.options.expectedNumberOfColonies = this.map.bases.length;
        }

        if (this.options.expectedNumberOfColonies > this.map.bases.length) {
            logger.error(`Number of colonies expected (${this.options.expectedNumberOfColonies}) is greater than the number of bases available (${this.map.bases.length})`);
            this.options.expectedNumberOfColonies = this.map.bases.length;
        }

        if (this.options.maxWaitTimeMsBeforeStartingGame !== 0) {
            logger.info(`The game will start automatically after ${this.options.maxWaitTimeMsBeforeStartingGame} ms or when ${this.options.expectedNumberOfColonies} colonies will have joined, whichever come first.`);

            this.maxWaitTimeInterval = setTimeout(() => {
                if (!this.isRunning && !this.isCompleted) {
                    if (this.colonies.length === 0) {
                        this.notifyGameCompleted([], new Error(`Max wait time for the game to start of ${this.options.maxWaitTimeMsBeforeStartingGame} ms exceeded but no colonies were registered.`));
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


    public registerViewer(v: Viewer) {
        this.viewers.push(v);
    }

    public deregisterViewer(v: Viewer) {
        this.viewers.splice(this.viewers.indexOf(v), 1);
    }

    private notifyGameCompleted(gameResults: GameResult[], err?: Error) {
        this.callbackOnGameCompleted.forEach(cb => cb(gameResults, err));
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

    public getUnitAtPosition(position: Position) {
        return this.colonies.flatMap(c => c.getUnitAtPosition(position)).filter(c => c !== undefined)[0];
    }

    public onGameCompleted(cb: (gameResults: GameResult[], err?: Error) => any) {
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

    public isTooCloseToEnemyBase(position: Position, colonyId: string) {
        return this.colonies.some((c) => {
            if (c.id === colonyId) return false;

            return (Math.abs(c.homeBase.x - position.x) <= COLONY.SAFE_ZONE_RADIUS) &&
                (Math.abs(c.homeBase.y - position.y) <= COLONY.SAFE_ZONE_RADIUS);
        });
    }

    public hasUnitOnPosition(position: Position) {
        return this.getUnitAtPosition(position) !== undefined;
    }

    public getLegalTilesForUnit(unit: Unit, atPosition?: Position) {
        const target = atPosition || unit.position;

        return this.map.getWalkableNeighbors(target)
            .filter(tile => !this.isTooCloseToEnemyBase(tile.position, unit.colony.id))
            .filter(tile => !this.hasUnitOnPosition(tile.position));
    }

    public computePathForUnitTo(unit: Unit, to: Position): Path {
        return aStar<Position>({
            start: unit.position,
            isEnd: (node) => hash(node) === hash(to),
            neighbor: (node) => this.getLegalTilesForUnit(unit, node).map(tile => tile.position),
            distance: distanceBetween,
            hash: hash,
            heuristic: () => 1
        });
    }

    public async play() {
        if (this.maxWaitTimeInterval) {
            clearTimeout(this.maxWaitTimeInterval);
        }

        if (this.isRunning) {
            throw new Error(`Game is already running.`);
        }

        this.colonies.forEach((c, i) => {
            c.homeBase = this.map.bases[i].position;
            c.spawnPoint = c.homeBase;
            c.blitzium = COLONY.START_BALANCE;
            c.totalBlitzium = c.blitzium;

            new Miner(c, c.homeBase);

            this.responseTimePerColony.set(c, {
                responseTimePerTicks: [],
                processingTimePerTicks: [],
                unitsPerTicks: [],
                nbTimeouts: 0
            });
        });

        this._isRunning = true;

        for (let tick = 0; tick < this.options.numberOfTicks; tick++) {
            logger.info(`Playing tick ${tick} of ${this.options.numberOfTicks}`);

            this._currentTick = tick;
            const startingState = this.serialize();

            logger.debug(`Sending Tick ${tick}: ${startingState}`);

            const allTickCommandsWaiting = this.colonies.map(async c => {
                try {
                    const stat = this.responseTimePerColony.get(c);
                    let command: Command | void = null;

                    if (this.options.timeMsAllowedPerTicks !== 0) {
                        let timeWhenStarted = new Date().getTime();

                        command = await Promise.race([
                            timeoutAfter(this.options.timeMsAllowedPerTicks),
                            c.getNextCommand({ colonyId: c.id, ...startingState })
                        ]);

                        stat.responseTimePerTicks.push(new Date().getTime() - timeWhenStarted);
                        stat.unitsPerTicks.push(c.units.length);
                    } else {
                        command = await c.getNextCommand({ colonyId: c.id, ...startingState });
                    }

                    if (command) {
                        logger.debug(`Command received for ${c}`, command);

                        let timeWhenStarted = new Date().getTime();
                        c.applyCommand(command);
                        stat.processingTimePerTicks.push(new Date().getTime() - timeWhenStarted);

                        this.notifyCommandApplied();
                    } else {
                        stat.nbTimeouts = stat.nbTimeouts + 1;
                        logger.info(`No command was received in time for ${c} on tick ${tick}`);
                    }

                    this.responseTimePerColony.set(c, stat);
                } catch (ex) {
                    logger.warn(`Error while fetching ${c} command for tick ${tick}.`, ex);
                }
            });

            try {
                await Promise.allSettled(allTickCommandsWaiting);

                this.viewers.forEach(v => v.onTick(this.serialize()));

                this.notifyTickApplied();
            } catch (ex) {
                logger.error(`An unhandled error occured`, ex);

                this._isRunning = false;
                this.notifyGameCompleted([], ex);

                throw ex;
            }


            if (this.colonies.length === 0 || this.colonies.every(c => c.isDead)) {
                logger.info('Closing game as no more colonies are responding');
                break;
            }
        }
        this._currentTick++;

        this._isCompleted = true;
        this._isRunning = false;

        this.colonies.forEach(c => {
            logger.info(`Sending stats for ${c}`);

            const stat = this.responseTimePerColony.get(c);
            const event = hny.newEvent();
            event.addField('game.team_name', c.name);
            event.addField('game.total_blitzium', c.totalBlitzium);
            event.addField('game.nb_of_units', c.units.length);
            event.addField('game.response_time_avg', stat.responseTimePerTicks.reduce((a, b) => a + b, 0) / stat.responseTimePerTicks.length);
            event.addField('game.processing_times_avg', stat.processingTimePerTicks.reduce((a, b) => a + b, 0) / stat.processingTimePerTicks.length);
            event.addField('game.nb_of_timeouts', stat.nbTimeouts);

            event.addField('service_name', "game");
            event.addField('name', "game_stats");

            event.send();
        });

        this.notifyGameCompleted(
            this.colonies
                .sort((a, b) => b.blitzium - a.blitzium)
                .map((c, i) => ({
                    rank: i + 1,
                    teamName: c.name,
                    score: c.blitzium
                })));
    };

    public serialize(): Tick {
        return {
            colonies: this.colonies.map(c => c.serialize()),
            tick: this._currentTick,
            totalTick: this.options.numberOfTicks,
            map: this.map?.serialize?.() ?? { tiles: [], depots: [] }
        }
    }
}