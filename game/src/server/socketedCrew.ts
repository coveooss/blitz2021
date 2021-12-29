import { Crew } from "../game/crews/crew";

import WebSocket from 'ws'
import { SocketMessage } from "./socketMessage";
import { Game } from "../game/game";
import { CrewError } from "../game/error";
import { logger } from "../logger";
import { PlayerTick } from '../game/types';
import { SocketedViewer } from "./socketedViewer";

interface SocketTickCallack {
    tick: number,
    resolve: (value: any) => void,
    reject: (err: any) => void
}

export class SocketedCrew extends Crew {
    private socketCallbacks: SocketTickCallack;

    public async getNextCommand(tick: PlayerTick): Promise<any> {
        if (this.socket.readyState === this.socket.CLOSED) {
            throw new CrewError(this, `Socket connection lost`);
        }

        if (this.socketCallbacks) {
            this.socketCallbacks = null;
        }

        const command = await new Promise((resolve, reject) => {
            this.socket.send(JSON.stringify({ type: "TICK", ...tick }));
            this.socketCallbacks = { tick: tick.tick, resolve, reject };
        });

        return command;
    }

    constructor(private socket: WebSocket, game: Game, name: string) {
        super(game, name);

        this.socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString()) as SocketMessage;

                switch (message.type) {
                    case 'COMMAND': {
                        if (message.tick !== this.socketCallbacks.tick) {
                            throw new CrewError(this, `Invalid tick number received: ${message.tick}`);
                        }

                        this.socketCallbacks.resolve(message);
                        break;
                    }
                    default: {
                        throw new CrewError(this, `Unexpected message type received: ${message}`);
                    }
                }
            } catch (ex) {
                // TO DO, do something different based on the error. 
                if (ex instanceof SyntaxError) {
                    logger.warn(`Invalid message from ${this}. ${ex.message}`, data);
                    return;
                }

                if (ex instanceof CrewError) {
                    logger.warn(`${this}. ${ex.message}`);
                    return;
                }

                throw ex;
            }
        });

        this.socket.on('close', () => {
            if (!this.game.isCompleted) {
                if (this.socketCallbacks) {
                    this.socketCallbacks.reject('Socket disconected');
                }

                this.isDead = true;
                logger.warn(`${this} disconnected`);
            }
        });
    }
}