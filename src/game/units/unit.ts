import { Position, isAdjacent } from "../position";
import { v4 as uuid } from 'uuid';
import { UnitError } from "game/error";
import { Colony } from "game/colonies/colony";
import { UnitType } from "game/types";


export abstract class Unit {
    public readonly id: string

    public cargo = 0;
    public path: Position[] = []

    constructor(private colony: Colony, protected position: Position, protected type: UnitType) {
        this.id = uuid();
    }

    public toString() {
        return `([${this.type}] ${this.id} ${JSON.stringify(this.position)})`
    }

    public move(target: Position) {
        const map = this.colony.game.map;

        const result = map.computePath(this.position, target);
        if (result.status === "noPath" || result.status === "timeout") {
            throw new UnitError(this, `No path to ${target}`);
        }

        this.position = result.path[0];
        this.path = result.path.slice(1);
    }

    public attack(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }

    public pickUp(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }
}