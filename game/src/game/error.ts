import { Unit } from "./units/unit";
import { Crew } from "./crews/crew";
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

export class CrewError extends Error {
    constructor(crew: Crew, message: string) {
        super(`${crew} ${message}`);
    }
}

export class UnitError extends Error {
    constructor(unit: Unit, message: string) {
        super(`${unit} ${message}`);
    }
}