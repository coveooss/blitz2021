import { v4 as uuid } from 'uuid';
import { Game } from '../game';
import { Position } from '../position';

export abstract class Colony {
    public readonly id: string;
    public readonly blitzium: number;
    protected _name: string;

    public homeBase: Position;

    constructor(protected game: Game) {
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

    public addUnit() {

    }

    public getUnit(unitId: string) {

    }

    public abstract async getNextCommand(tick: any): Promise<any>;

    public toString() {
        return `([Colony] ${this.id} - ${this.name})`;
    }
}