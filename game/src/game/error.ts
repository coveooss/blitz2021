import { Unit } from "./units/unit";
import { Colony } from "./colonies/colony";
import { CommandAction } from './types';

export class FatalError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class SocketRegisteringError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class CommandActionError extends Error {
    constructor(action: CommandAction, message: string) {
        super(`${action} ${message}`);
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