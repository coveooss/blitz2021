import { Colony } from "game/colonies/colony";
import { Unit } from "./unit";
import { Position } from "game/position";
import { UnitError } from "game/error";


export class Cart extends Unit {
    constructor(colony: Colony, position: Position) {
        super(colony, position, "CART");
    }

    public attack(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }
}