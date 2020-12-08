import { Colony } from "../colonies/colony";
import { Unit } from "./unit";
import { Position } from "../position";
import { UnitError } from "../error";


export class Cowboy extends Unit {
    constructor(colony: Colony, position: Position) {
        super(colony, position, "COWBOY");
    }

    public pickUp(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }
}