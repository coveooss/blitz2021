import { Command, Tick } from "../game/types";

export type SocketMessage = SocketRegisterNameMessage | SocketRegisterTokenMessage | SocketCommandMessage | SocketViewerMessage;

export type SocketRegisterNameMessage = {
    type: "REGISTER",
    crewName: string
}

export type SocketRegisterTokenMessage = {
    type: "REGISTER",
    token: string
}

export type SocketViewerMessage = {
    type: "VIEWER"
}

export type SocketCommandMessage = {
    type: "COMMAND",
    tick: number,
    commands: Command
}

export type SocketRegisterAckMessage = {
    type: "REGISTER_ACK",
    crewName: string,
    crewId: string
}

export type SocketTickMessage = Tick & {
    type: "TICK",
}

export const socketRegisterMessage = (crewName: string): string =>
    JSON.stringify({
        type: "REGISTER",
        crewName
    });

export const socketRegisterAckMessage = (crewName: string, crewId: string): string =>
    JSON.stringify({
        type: "REGISTER_ACK",
        crewId,
        crewName
    });
