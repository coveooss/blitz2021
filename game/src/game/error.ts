import { Unit } from "./units/unit";
import { Colony } from "./colonies/colony";
import WebSocket from 'ws';

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