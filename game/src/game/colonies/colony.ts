import { UNIT } from '../config';
import { ColonyError, UnitError } from '../error';
import { Command, PlayerTick, TickColony, UnitType } from '../types';
import { Cart } from '../units/cart';
import { Cowboy } from '../units/cowboy';
import { Miner } from '../units/miner';
import { Unit } from '../units/unit';
import { v4 as uuid } from 'uuid';
import { Game } from '../game';
import { equal, Position } from '../position';

export abstract class Colony {
    public readonly id: string;
    public blitzium: number;
    public totalBlitzium: number;

    public units: Unit[];
    private errors: string[] = [];

    public homeBase: Position;
    public spawnPoint: Position;

    constructor(public game: Game, public name: string) {
        this.blitzium = 0;
        this.units = [];
        this.id = uuid();

        this.game.registerColony(this);
    }

    public dropBlitzium(blitzium:number) {
        this.blitzium = this.blitzium + blitzium;
        this.totalBlitzium = this.totalBlitzium + blitzium;
    }

    private buyUnit(type: UnitType) {
        switch (type) {
            case "MINER": {
                if (this.blitzium < UNIT.MINER_COST) {
                    throw new ColonyError(this, `Unit ${type} is too expensive ${UNIT.MINER_COST}`);
                }

                this.units.push(new Miner(this, this.spawnPoint));
                break;
            }
            case "CART": {
                if (this.blitzium < UNIT.CART_COST) {
                    throw new ColonyError(this, `Unit ${type} is too expensive ${UNIT.CART_COST}`);
                }

                this.units.push(new Cart(this, this.spawnPoint));
                break;
            }
            case "CART": {
                if (this.blitzium < UNIT.COWBOY_COST) {
                    throw new ColonyError(this, `Unit ${type} is too expensive ${UNIT.COWBOY_COST}`);
                }

                this.units.push(new Cowboy(this, this.spawnPoint));
                break;
            }
        }
    }

    public getUnit(unitId: string): Unit {
        return this.units.find(u => u.id === unitId);
    }

    public getUnitAtPosition(position: Position): Unit {
        return this.units.find(u => equal(u.position, position));
    }

    public applyCommand(command: Command) {
        let alreadyHasBuyCommand = false;
        this.errors = [];

        if (command.actions === undefined) {
            this.errors.push(`No actions received`);
        }

        command.actions?.forEach(action => {
            try {
                if (action.type === "BUY") {
                    if (alreadyHasBuyCommand) {
                        throw new ColonyError(this, `Buy action already processed`);
                    }
                    this.buyUnit(action.unitType);
                } else {
                    const unit = this.getUnit(action.unitId);
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
                if (ex instanceof UnitError) {
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
            units: this.units.map(u => u.serialize())
        }
    }
}