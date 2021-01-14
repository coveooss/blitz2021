import { Crew } from "../crews/crew";
import { Unit } from "./unit";
import { Position } from "../position";
import { UnitError } from "../error";
import { UNIT } from "../config";


export class Cart extends Unit {
    constructor(crew: Crew, position: Position) {
        super(crew, position, "CART");

        this.maxBlitzium = UNIT.MAX_CART_CARGO;
    }

    public attack(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }

    public mine(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }
}