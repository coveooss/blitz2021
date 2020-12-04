import { Colony } from "game/colonies/colony";
import { Unit } from "./unit";
import { Position } from "game/position";
import { UnitError } from "game/error";


export class Cowboy extends Unit {
    constructor(colony: Colony, position: Position) {
        super(colony, position, "COWBOY");
    }

    public pickUp(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }
}