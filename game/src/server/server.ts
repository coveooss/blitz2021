import WebSocket from 'ws';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';
import { createServer, Server as HttpServer } from 'http';
import { Game } from '../game/game';
import { SocketedCrew } from './socketedCrew';
import { logger } from '../logger';
import { SocketMessage } from './socketMessage';
import { SocketedViewer } from './socketedViewer';
import { CrewError, SocketRegisteringError } from '../game/error';

export class Server {
    private server: HttpServer;
    private webSocketServer: WebSocket.Server;

    constructor(private port: number = 8765, private game: Game, private serveUi: boolean = true, private teamNamesByToken: { [token: string]: string } = null) {
        if (this.serveUi) {
            logger.info(`Web viewer available on http://localhost:${port}/viewer.html`);

            let serve = serveStatic('./ui/');
            this.server = createServer(function (req, res) {
                var done = finalhandler(req, res);
                serve(req, res, () => done(null));
            });
        } else {
            this.server = createServer();
        }

        this.game.onGameCompleted((gameResults, err) => {
            gameResults.forEach(r => logger.info(`Team ${r.teamName} finished #${r.rank} with ${r.score} blitzium!`));

            if (err) {
                logger.error(`An error occured while playing the game.`, err);
            }

            this.webSocketServer.clients.forEach(c => c.close());

            this.webSocketServer.close((err) => {
                if (err) {
                    logger.error(`An error occured while closing the websocket. ${err}`, err);
                }
            });

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
                    let registerTimeout = setTimeout(() => {
                        logger.warn(`Client didn't registered in time, closing the connection.`);
                        socket.close()
                    }, 5000);

                    socket.on('close', () => {
                        clearTimeout(registerTimeout);
                    });

                    socket.on('message', (data) => {
                        try {
                            const message = JSON.parse(data.toString()) as SocketMessage

                            if (message.type === 'VIEWER') {
                                const viewer = new SocketedViewer(socket, this.game);
                                logger.debug(`New Viewer connection for ${viewer}`, socket);

                                clearTimeout(registerTimeout);
                            }

                            if (message.type === 'REGISTER') {
                                let crewName;


                                if ("token" in message) {
                                    if (!this.teamNamesByToken && message.token !== "") {
                                        throw new SocketRegisteringError('You need to register using a crewName');
                                    }

                                    crewName = this.teamNamesByToken[message.token];
                                }

                                if ("crewName" in message) {
                                    if (this.teamNamesByToken && crewName !== "") {
                                        throw new SocketRegisteringError('You need to register using your secret token');
                                    }

                                    crewName = message.crewName;
                                }

                                if (!crewName || crewName === "") {
                                    throw new SocketRegisteringError(`You need to specify a crew name`);
                                }

                                const crew = new SocketedCrew(socket, this.game, crewName);
                                logger.debug(`New socket connection for ${crew}`, socket);

                                clearTimeout(registerTimeout);
                            }
                        } catch (ex) {
                            if (ex instanceof SocketRegisteringError || ex instanceof SyntaxError || ex instanceof CrewError) {
                                logger.warn(ex.message);
                            } else {
                                throw ex;
                            }

                            socket.close();
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