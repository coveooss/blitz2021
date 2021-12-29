import WebSocket from 'ws';

import { Server } from '../src/server/server'
import { Game } from '../src/game/game';

describe("Server", () => {
    const SOCKET_PORT = 54821;
    const SOCKET_ADDR = `ws://localhost:${SOCKET_PORT}`;

    const NUMBER_OF_TICKS = 5;

    let server: Server = null;
    let game: Game = null;

    beforeEach(() => {
        game = new Game({ numberOfTicks: NUMBER_OF_TICKS, timeMsAllowedPerTicks: 0 });
        server = new Server(SOCKET_PORT, game, false);

        server.listen();
    });

    afterEach(async () => {
        await server.close();
    })

    it.skip('should received a valid tick per turn', (done) => {
        const client = new WebSocket(SOCKET_ADDR);
        const CREW_NAME = "myCrew";

        let currentTick = 0;

        client.on('open', () => {
            client.send(JSON.stringify({ type: "REGISTER", crewName: CREW_NAME }), (err) => {
                if (err) {
                    throw err;
                }
            });

            client.on('message', (data) => {
                const message = JSON.parse(data.toString()) as any;

                if (message.type === "REGISTER_ACK") {
                    game.play();
                }

                if (message.type !== "TICK") {
                    return;
                }

                expect(message.tick).toBe(currentTick);
                client.send(JSON.stringify({ type: "COMMAND", tick: currentTick }));

                currentTick++;
            });

            client.on("close", () => {
                expect(currentTick).toBe(NUMBER_OF_TICKS);
                done();
            });

            client.send(JSON.stringify({ type: "REGISTER", crewName: CREW_NAME }), (err) => {
                if (err) {
                    throw err;
                }
            });
        });

        expect(game.crews).toHaveLength(0);
    });
})