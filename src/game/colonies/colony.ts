import { UnitError } from 'game/error';
import { Command, UnitType } from 'game/types';
import { Unit } from 'game/units/unit';
import { v4 as uuid } from 'uuid';
import { Game } from '../game';
import { Position } from '../position';

export abstract class Colony {
    public readonly id: string;
    public readonly blitzium: number;

    protected _name: string;

    private errors: string[];

    public homeBase: Position;

    constructor(public game: Game) {
        this.blitzium = 0;
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

    }

    public getUnit(unitId: string): Unit {

    }

    public applyCommand(command: Command) {
        this.errors = [];

        command.actions.forEach(action => {
            try {
                if (action.type === "BUY") {
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