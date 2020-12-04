import { UNIT } from 'game/config';
import { ColonyError, UnitError } from 'game/error';
import { Command, UnitType } from 'game/types';
import { Cart } from 'game/units/cart';
import { Cowboy } from 'game/units/cowboy';
import { Miner } from 'game/units/miner';
import { Unit } from 'game/units/unit';
import { v4 as uuid } from 'uuid';
import { Game } from '../game';
import { Position } from '../position';

export abstract class Colony {
    public readonly id: string;
    public readonly blitzium: number;
    public readonly totalBlitzium: number;

    protected _name: string;

    private units: Unit[];
    private errors: string[];

    public homeBase: Position;
    public spawnPoint: Position;

    constructor(public game: Game) {
        this.blitzium = 0;
        this.units = [];
        this.id = uuid();
    }

    get name(): string {
        return this._name;
    }

    public init(name: string) {
        this._name = name;
        this.game.registerColony(this);
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

    public applyCommand(command: Command) {
        let alreadyHasBuyCommand = false;
        this.errors = [];

        command.actions.forEach(action => {
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

                    if (action.action === "PICKUP") {
                        unit.pickUp(action.target);
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

    public abstract async getNextCommand(tick: any): Promise<Command>;

    public toString() {
        return `([Colony] ${this.id} - ${this.name})`;
    }
}