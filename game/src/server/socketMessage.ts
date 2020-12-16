import { Command, Tick } from "../game/types";

export type SocketMessage = SocketRegisterNameMessage | SocketRegisterTokenMessage | SocketCommandMessage | SocketViewerMessage;

export type SocketRegisterNameMessage = {
    type: "REGISTER",
    colonyName: string
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
    colonyName: string,
    colonyId: string
}

export type SocketTickMessage = Tick & {
    type: "TICK",
}

export const socketRegisterMessage = (colonyName: string): string =>
    JSON.stringify({
        type: "REGISTER",
        colonyName
    });

export const socketRegisterAckMessage = (colonyName: string, colonyId: string): string =>
    JSON.stringify({
        type: "REGISTER_ACK",
        colonyId,
        colonyName
    });
