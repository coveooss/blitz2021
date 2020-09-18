import { Colony } from "./game/colonies/colony";

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