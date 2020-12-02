import WebSocket from 'ws'
const SOCKET_ADDR = "ws://localhost:3000";

const startClient = () => {
    try {
        const client = new WebSocket(SOCKET_ADDR);

        client.on('open', () => {
            let isRegistered: boolean = false;
            let colonyId: string = null;

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

                        console.log(JSON.stringify(message));

                        setTimeout(() => {
                            client.send(JSON.stringify({ type: "COMMAND", tick: message.tick }));
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