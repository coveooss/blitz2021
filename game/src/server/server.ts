import WebSocket from 'ws';
import { Game } from '../game/game';
import { SocketedColony } from './socketedColony';
import { logger } from '../logger';

export class Server {
    private webSocketServer: WebSocket.Server;

    constructor(private port: number = 3000, private game: Game) {
        this.game.onGameCompleted((err) => {
            if (err) {
                logger.error(`An error occured while playing the game.`, err);
            }

            this.webSocketServer.close((err) => {
                if (err) {
                    logger.error(`An error occured while closing the server. ${err}`, err);
                }
            })
        });
    }

    public async listen() {
        return new Promise((resolve, reject) => {
            try {
                this.webSocketServer = new WebSocket.Server({ port: this.port });
                this.webSocketServer.on('connection', socket => {
                    const colony = new SocketedColony(socket, this.game);
                    logger.debug(`New socket connection for ${colony}`, socket);
                });

                logger.info(`Game server listening on port ${this.port}`);

                this.webSocketServer.on("close", () => {
                    resolve()
                });
            } catch (ex) {
                logger.error("Error starting the server", ex);
                reject(ex);
            }
        });
    }

    public async close() {
        return new Promise((resolve, reject) => {
            this.webSocketServer.close((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}