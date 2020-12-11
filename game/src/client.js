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

                    case "TICK": {
                        const colonyId = message.colonyId;
                        const myColony = message.colonies.find(c => c.id === colonyId);

                        const randomPosition = () => {
                            return { x: Math.round(Math.random() * 50), y: Math.round(Math.random() * 50) }
                        }

                        let depot = null;
                        let depotPoint = null;

                        let homeBasePoint = { x: myColony.homeBase.x, y: myColony.homeBase.y + 1 }


                        message.map.tiles.forEach((row, x) => {
                            row.forEach((tile, y) => {
                                if (tile === 'MINE') {
                                    depot = { x, y: y };
                                    depotPoint = { x, y: y - 1 };
                                }
                            })
                        })

                        const actions = myColony.units.map(u => {
                            if (u.blitzium > 0 && u.position.x === homeBasePoint.x && u.position.y === homeBasePoint.y) {
                                console.log('DROPING');
                                return { type: 'UNIT', action: 'DROP', unitId: u.id, target: myColony.homeBase }
                            }

                            if (u.blitzium === 4 && (u.position.x !== homeBasePoint.x || u.position.y !== homeBasePoint.y)) {
                                console.log('GOING TO HOME');
                                return { type: 'UNIT', action: 'MOVE', unitId: u.id, target: myColony.homeBase }
                            }

                            if (u.blitzium === 0 && (u.position.x !== depotPoint.x || u.position.y !== depotPoint.y)) {
                                console.log('GOING TO DEPOT');
                                return { type: 'UNIT', action: 'MOVE', unitId: u.id, target: depot }
                            }

                            if (u.blitzium < 4 && u.position.x === depotPoint.x && u.position.y === depotPoint.y) {
                                console.log('MINING');
                                return { type: 'UNIT', action: 'MINE', unitId: u.id, target: { ...depot, y: depot.y } }
                            }
                        });

                        setTimeout(() => {
                            client.send(JSON.stringify({ type: "COMMAND", tick: message.tick, actions }));
                        }, 100);
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