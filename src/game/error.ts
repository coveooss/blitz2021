import { Unit } from "game/units/unit";
import { Colony } from "./colonies/colony";

export class FatalError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ColonyError extends Error {
    constructor(colony: Colony, message: string) {
        super(`${colony} ${message}`);
    }
}

export class UnitError extends Error {
    constructor(unit: Unit, message: string) {
        super(`${unit} ${message}`);
    }
}