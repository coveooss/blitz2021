import { Colony } from "../game/colonies/colony";

import WebSocket from 'ws'
import { SocketMessage } from "./socketMessage";
import { Game } from "../game/game";
import { FatalError, ColonyError } from "../error";
import { logger } from "../logger";

interface SocketTickCallack {
    tick: number,
    resolve: (value: any) => void,
    reject: (err: any) => void
}

export class SocketedColony extends Colony {
    private socketCallbacks: SocketTickCallack;

    public async getNextCommand(tick: any): Promise<any> {
        if (this.socketCallbacks) {
            this.socketCallbacks = null;
        }

        const command = await new Promise((resolve, reject) => {
            this.socket.send(JSON.stringify({ type: "TICK", tick: tick.tick }));
            this.socketCallbacks = { tick: tick.tick, resolve, reject };
        });

        return command;
    }

    constructor(private socket: WebSocket, game: Game) {
        super(game);

        this.socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString()) as SocketMessage;

                switch (message.type) {
                    case 'REGISTER': {
                        this.init(message.colonyName);
                        this.socket.send(JSON.stringify({ type: "REGISTER_ACK", colonyId: this.id, colonyName: this.name }));
                        break;
                    }
                    case 'COMMAND': {
                        if (message.tick !== this.socketCallbacks.tick) {
                           throw new ColonyError(this, `Invalid tick number received: ${message.tick}`);
                        }

                        this.socketCallbacks.resolve(message);
                        break;
                    }
                    default: {
                        throw new ColonyError(this, `Unexpected message type received: ${message}`);
                    }
                }
            } catch (ex) {
                // TO DO, do something different based on the error. 
                if (ex instanceof SyntaxError) {
                    logger.warn(`Invalid message from ${this}. ${ex.message}`, data);
                    return;
                }

                if (ex instanceof ColonyError) {
                    logger.info(`${this}. ${ex.message}`);
                    return;
                }

                throw ex;
            }
        });
    }
}