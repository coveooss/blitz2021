import WebSocket from 'ws';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';
import { createServer, Server as HttpServer } from 'http';
import { Game } from '../game/game';
import { SocketedColony } from './socketedColony';
import { logger } from '../logger';
import { SocketMessage } from './socketMessage';
import { SocketedViewer } from './socketedViewer';

export class Server {
    private server: HttpServer;
    private webSocketServer: WebSocket.Server;

    constructor(private port: number = 8765, private game: Game, private serveUi: boolean) {
        if (this.serveUi) {
            let serve = serveStatic('./ui/');
            this.server = createServer(function (req, res) {
                var done = finalhandler(req, res);
                serve(req, res, () => done(null));
            });
        } else {
            this.server = createServer();
        }

        this.game.onGameCompleted((err) => {
            if (err) {
                logger.error(`An error occured while playing the game.`, err);
            }

            this.webSocketServer.close((err) => {
                if (err) {
                    logger.error(`An error occured while closing the websocket. ${err}`, err);
                }
            })

            this.server.close((err) => {
                if (err) {
                    logger.error(`An error occured while closing the server. ${err}`, err);
                }
            });
        });
    }

    public async listen() {
        return new Promise((resolve, reject) => {
            try {
                this.webSocketServer = new WebSocket.Server({ server: this.server });
                this.webSocketServer.on('connection', socket => {
                    socket.on('message', (data) => {
                        const message = JSON.parse(data.toString()) as SocketMessage

                        if (message.type === 'VIEWER') {
                            const viewer = new SocketedViewer(socket, this.game);
                            logger.debug(`New Viewer connection for ${viewer}`, socket);
                        }

                        if (message.type === 'REGISTER') {
                            const colony = new SocketedColony(socket, this.game, message.colonyName);
                            logger.debug(`New socket connection for ${colony}`, socket);
                        }
                    });
                });

                this.server.listen({ port: this.port })

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