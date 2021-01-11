import { COLONY, UNIT } from '../config';
import { ColonyError, CommandActionError, UnitError } from '../error';
import { Command, CommandActionBuy, PlayerTick, TickColony, UnitType } from '../types';
import { Cart } from '../units/cart';
import { Outlaw } from '../units/outlaw';
import { Miner } from '../units/miner';
import { Unit } from '../units/unit';
import { v4 as uuid } from 'uuid';
import { Game } from '../game';
import { equal, Position } from '../position';

export abstract class Colony {
    public id: string;
    public blitzium: number;
    public totalBlitzium: number;

    public units: Unit[];
    public errors: string[] = [];

    public homeBase: Position;
    public isDead: boolean = false;

    constructor(public game: Game, public name: string) {
        this.blitzium = 0;
        this.totalBlitzium = 0;
        this.units = [];
        this.id = uuid();

        this.game.registerColony(this);
    }

    public getUnitPrices() {
        const computePrice = (base: number) => Math.round(base * Math.pow(COLONY.UNIT_MULTIPLIER, Math.max(this.units.length - 1, 0)));

        return {
            "MINER": computePrice(UNIT.MINER_COST),
            "CART": computePrice(UNIT.CART_COST),
            "OUTLAW": computePrice(UNIT.OUTLAW_COST)
        }
    }

    public dropBlitzium(blitzium: number) {
        this.blitzium = this.blitzium + blitzium;
        this.totalBlitzium = this.totalBlitzium + blitzium;
    }

    public buyUnit(action: CommandActionBuy) {
        let unitPrice = this.getUnitPrices()[action.unitType];

        if (unitPrice === undefined) {
            throw new CommandActionError(action, `Invalid unitType ${action.unitType}`);
        }

        if (unitPrice > this.blitzium) {
            throw new CommandActionError(action, `Unit ${action.unitType} is too expensive ${unitPrice}`);
        }

        if (this.game.hasUnitOnPosition(this.homeBase)) {
            throw new CommandActionError(action, `There's a unit already at home base`);
        }

        this.blitzium = this.blitzium - unitPrice;

        switch (action.unitType) {
            case "MINER": {
                new Miner(this, this.homeBase);
                break;
            }
            case "CART": {
                new Cart(this, this.homeBase);
                break;
            }
            case "OUTLAW": {
                new Outlaw(this, this.homeBase);
                break;
            }
        }
    }

    public getUnit(unitId: string): Unit | undefined {
        return this.units.find(u => u.id === unitId);
    }

    public getUnitAtPosition(position: Position): Unit {
        return this.units.find(u => equal(u.position, position));
    }

    public applyCommand(command: Command) {
        let alreadyHasBuyCommand = false;
        let alreadyReceivedCommand: Unit[] = [];
        this.errors = [];

        if (command.actions === undefined) {
            this.errors.push(`No actions received`);
        }

        command.actions?.forEach(action => {
            try {
                if (!action) {
                    throw new CommandActionError(action, `Invalid action was sent ${JSON.stringify(action)}`);
                }

                if (action.type === "BUY") {
                    if (alreadyHasBuyCommand) {
                        throw new CommandActionError(action, `Buy action already processed`);
                    }

                    this.buyUnit(action);
                } else {
                    const unit = this.getUnit(action.unitId);

                    if (!unit) {
                        throw new CommandActionError(action, `Unit ${action.unitId} doesn't exists!`);
                    }

                    if (alreadyReceivedCommand.includes(unit)) {
                        throw new CommandActionError(action, `Unit ${unit} already received a command!`);
                    }

                    alreadyReceivedCommand.push(unit);

                    if (action.action === "NONE") {
                        return;
                    }

                    if (action.action === "MOVE") {
                        unit.move(action.target);
                        return;
                    }

                    if (action.action === "ATTACK") {
                        unit.attack(action.target);
                        return;
                    }

                    if (action.action === "PICKUP") {
                        unit.pickup(action.target);
                        return;
                    }

                    if (action.action === "MINE") {
                        unit.mine(action.target);
                        return;
                    }

                    if (action.action === "DROP") {
                        unit.drop(action.target);
                        return;
                    }

                    throw new UnitError(unit, `Invalid action ${action.action}`);
                }
            } catch (ex) {
                if (ex instanceof UnitError || ex instanceof CommandActionError) {
                    this.errors.push(ex.message);
                } else {
                    throw ex;
                }
            }
        });

        if (this.units.filter(u => u.type === "MINER").length === 0) {
            if (this.game.hasUnitOnPosition(this.homeBase)) {
                this.errors.push(`Can't respawn a MINER; home base already occupied`);
            }

            new Miner(this, this.homeBase);
        }
    }

    public abstract getNextCommand(tick: PlayerTick): Promise<Command>;

    public findNearestSpawnPoint(from: Position = this.homeBase): Position {
        let allCandidates = this.game.map.getNeighbors(from);
        let validCandidates = allCandidates.filter(t => !this.game.hasUnitOnPosition(t.position));

        if (validCandidates.length > 0) {
            return validCandidates[0].position;
        } else {
            let nextCandidates = allCandidates.map(t => this.findNearestSpawnPoint(t.position));
            if (nextCandidates.length > 0) {
                return nextCandidates[0];
            }

            throw new ColonyError(this, `Impossible to find a spawn point`);
        }
    }

    public toString() {
        return `([Colony] ${this.id} - ${this.name})`;
    }

    public serialize(): TickColony {
        return {
            id: this.id,
            name: this.name,
            errors: this.errors,
            homeBase: this.homeBase,
            safeZoneRadius: COLONY.SAFE_ZONE_RADIUS,
            blitzium: this.blitzium,
            totalBlitzium: this.totalBlitzium,
            units: this.units.map(u => u.serialize()),
            prices: this.getUnitPrices()
        }
    }
}