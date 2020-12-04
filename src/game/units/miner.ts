import { Colony } from "game/colonies/colony";
import { Unit } from "./unit";
import { Position } from "game/position";
import { UnitError } from "game/error";
import { UNIT } from "game/config";


export class Miner extends Unit {
    constructor(colony: Colony, position: Position) {
        super(colony, position, "MINER");
    }

    public move(target: Position) {
        if (this.cargo >= UNIT.MAX_MINER_MOVE_CARGO) {
            throw new UnitError(this, `Miner can't move because it has too much cargo ${this.cargo} > ${UNIT.MAX_MINER_MOVE_CARGO}`);
        }

        super.move(target);
    }

    public attack(target: Position) {
        throw new UnitError(this, 'Action not supported');
    }
}