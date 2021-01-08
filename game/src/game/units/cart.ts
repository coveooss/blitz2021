import { Colony } from "../colonies/colony";
import { Unit } from "./unit";
import { Position } from "../position";
import { UnitError } from "../error";
import { UNIT } from "../config";


export class Cart extends Unit {
    constructor(colony: Colony, position: Position) {
        super(colony, position, "CART");

        this.maxBlitzium = UNIT.MAX_CART_CARGO;
    }

    public attack(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }
}