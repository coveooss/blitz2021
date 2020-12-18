import { UNIT } from '../config';
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
    public spawnPoint: Position;

    public isDead: boolean = false;

    constructor(public game: Game, public name: string) {
        this.blitzium = 0;
        this.totalBlitzium = 0;
        this.units = [];
        this.id = uuid();

        this.game.registerColony(this);
    }

    public dropBlitzium(blitzium: number) {
        this.blitzium = this.blitzium + blitzium;
        this.totalBlitzium = this.totalBlitzium + blitzium;
    }

    private buyUnit(action: CommandActionBuy) {
        switch (action.unitType) {
            case "MINER": {
                if (this.blitzium < UNIT.MINER_COST) {
                    throw new CommandActionError(action, `Unit ${action.unitType} is too expensive ${UNIT.MINER_COST}`);
                }

                this.blitzium = this.blitzium - UNIT.MINER_COST;
                new Miner(this, this.spawnPoint);
                break;
            }
            case "CART": {
                if (this.blitzium < UNIT.CART_COST) {
                    throw new CommandActionError(action, `Unit ${action.unitType} is too expensive ${UNIT.CART_COST}`);
                }

                this.blitzium = this.blitzium - UNIT.CART_COST;
                new Cart(this, this.spawnPoint);
                break;
            }
            case "OUTLAW": {
                if (this.blitzium < UNIT.OUTLAW_COST) {
                    throw new CommandActionError(action, `Unit ${action.unitType} is too expensive ${UNIT.OUTLAW_COST}`);
                }

                this.blitzium = this.blitzium - UNIT.OUTLAW_COST;
                new Outlaw(this, this.spawnPoint);
                break;
            }
            default: {
                new CommandActionError(action, `Invalid unitType ${action.unitType}`);
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
    }

    public abstract async getNextCommand(tick: PlayerTick): Promise<Command>;

    public toString() {
        return `([Colony] ${this.id} - ${this.name})`;
    }

    public serialize(): TickColony {
        return {
            id: this.id,
            name: this.name,
            errors: this.errors,
            homeBase: this.homeBase,
            spawnPoint: this.spawnPoint,
            blitzium: this.blitzium,
            totalBlitzium: this.totalBlitzium,
            units: this.units.map(u => u.serialize())
        }
    }
}