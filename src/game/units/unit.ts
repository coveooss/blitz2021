import { Position, isAdjacent } from "../position";
import { v4 as uuid } from 'uuid';

export abstract class Unit {
    protected id: string

    constructor(protected position: Position, protected type: string) {
        this.id = uuid();
    }

    public toString() {
        return `([${this.type}] ${this.id} ${JSON.stringify(this.position)})`
    }

    public move() {}
    public attack() {}
    public pickUp() {}
}