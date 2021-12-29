import { Crew } from "../crews/crew";
import { Unit } from "./unit";
import { Position } from "../position";
import { UnitError } from "../error";


export class Outlaw extends Unit {
    constructor(crew: Crew, position: Position) {
        super(crew, position, "OUTLAW");
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