import { Crew } from "../crews/crew";
import { Unit } from "./unit";
import { Position } from "../position";
import { UnitError } from "../error";
import { UNIT } from "../config";


export class Miner extends Unit {
    constructor(crew: Crew, position: Position) {
        super(crew, position, "MINER");

        this.maxBlitzium = UNIT.MAX_MINER_CARGO;
    }

    public move(target: Position) {
        if (this.blitzium > UNIT.MAX_MINER_MOVE_CARGO) {
            throw new UnitError(this, `Miner can't move because it has too much cargo ${this.blitzium} > ${UNIT.MAX_MINER_MOVE_CARGO}`);
        }

        super.move(target);
    }

    public attack(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }
}