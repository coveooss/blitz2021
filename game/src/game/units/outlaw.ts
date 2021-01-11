import { Colony } from "../colonies/colony";
import { Unit } from "./unit";
import { Position } from "../position";
import { UnitError } from "../error";


export class Outlaw extends Unit {
    constructor(colony: Colony, position: Position) {
        super(colony, position, "OUTLAW");
    }

    public pickUp(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }

    public mine(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }

    public drop(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }

}