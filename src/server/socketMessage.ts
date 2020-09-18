export type SocketMessage = SocketRegisterMessage | SocketCommandMessage;

export type SocketRegisterMessage = {
    type: "REGISTER",
    colonyName: string
}

export type SocketCommandMessage = {
    type: "COMMAND",
    tick: number
}

export type SocketRegisterAckMessage = {
    type: "REGISTER_ACK",
    colonyName: string,
    colonyId: string
}

export type SocketTickMessage = {
    type: "TICK",
    tick: number
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
