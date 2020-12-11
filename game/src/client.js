const WebSocket = require('ws');
const SOCKET_ADDR = "ws://localhost:3000";

const startClient = () => {
    try {
        const client = new WebSocket(SOCKET_ADDR);

        client.on('open', () => {
            let isRegistered = false;
            let colonyId = null;

            client.send(JSON.stringify({ type: "REGISTER", colonyName: "TestClient" }));

            client.on('message', (data) => {
                const message = JSON.parse(data.toString());

                switch (message.type) {
                    case "REGISTER_ACK": {
                        if (isRegistered) {
                            throw new Error('Colony already registered but received REGISTER_ACK');
                        }

                        isRegistered = true;
                        colonyId = message.colonyId;
                        break;
                    }
                    case "TICK": {
                        if (!isRegistered) {
                            throw new Error('Colony received a tick before being registered');
                        }



                        const colonyId = message.colonyId;
                        const myColony = message.colonies.find(c => c.id === colonyId);

                        console.log(JSON.stringify(myColony));

                        const randomPosition = () => {
                            return { x: Math.round(Math.random() * 50), y: Math.round(Math.random() * 50) }
                        }

                        const actions = myColony.units.map(u => ({ type: 'UNIT', action: 'MOVE', unitId: u.id, target: randomPosition() }));

                        setTimeout(() => {
                            client.send(JSON.stringify({ type: "COMMAND", tick: message.tick, actions }));
                        }, 500);
                    }
                }
            });

            client.on('close', () => {
                startClient();
            });
        });
    } catch {
        setTimeout(startClient, 1000);
    }
}

startClient();