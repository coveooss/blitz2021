const WebSocket = require('ws');
const SOCKET_ADDR = "ws://localhost:8765";

const startClient = () => {
    try {
        const client = new WebSocket(SOCKET_ADDR);

        client.on('open', () => {
            let isRegistered = false;
            let crewId = null;
            let randomBlitzium = 1 + Math.round(Math.random() * 3);

            const token = process.env.TOKEN;

            if (token) {
                client.send(JSON.stringify({ type: "REGISTER", token: token }));
            } else {
                client.send(JSON.stringify({ type: "REGISTER", crewName: "MinerSquared" }));
            }

            client.on('message', (data) => {
                const message = JSON.parse(data.toString());

                switch (message.type) {

                    case "TICK": {
                        const crewId = message.crewId;
                        const myCrew = message.crews.find(c => c.id === crewId);

                        let depot = null;
                        let depotPoint = null;

                        let homeBasePoint = { x: myCrew.homeBase.x, y: myCrew.homeBase.y + 1 }


                        message.map.tiles.forEach((row, x) => {
                            row.forEach((tile, y) => {
                                if (tile === 'MINE') {
                                    depot = { x, y: y };
                                    depotPoint = { x, y: y + 1 };
                                }
                            })
                        });

                        


                        myCrew.errors.forEach(c => console.log(c));
                        console.log(myCrew.blitzium);
                        console.log(myCrew.totalBlitzium);
                        const actions = myCrew.units.map(u => {
                            console.log(JSON.stringify(u.position));
                            
                            if (u.blitzium > 0 && u.position.x === homeBasePoint.x && u.position.y === homeBasePoint.y) {
                                console.log('DROPING');
                                return { type: 'UNIT', action: 'DROP', unitId: u.id, target: myCrew.homeBase }
                            }

                            if (u.blitzium == randomBlitzium && !(u.position.x == homeBasePoint.x && u.position.y == homeBasePoint.y)) {
                                console.log('GOING TO HOME ' + JSON.stringify(homeBasePoint));
                                return { type: 'UNIT', action: 'MOVE', unitId: u.id, target: homeBasePoint }
                            }

                            if (u.blitzium === 0 && (u.position.x !== depotPoint.x || u.position.y !== depotPoint.y)) {
                                console.log('GOING TO DEPOT');
                                return { type: 'UNIT', action: 'MOVE', unitId: u.id, target: depotPoint }
                            }

                            if (u.blitzium <= randomBlitzium && u.position.x === depotPoint.x && u.position.y === depotPoint.y) {
                                console.log('MINING');
                                return { type: 'UNIT', action: 'MINE', unitId: u.id, target: { ...depot, y: depot.y } }
                            }

                            return { type: 'UNIT', action: 'NONE' };
                        });



                        console.log(myCrew.units.length);
                        setTimeout(() => {
                            client.send(JSON.stringify({ type: "COMMAND", tick: message.tick, actions }));
                        }, 100);
                    }
                }
            });

            client.on('close', () => {
                setTimeout(startClient, 1000);
            });
        });
    } catch {
        setTimeout(startClient, 1000);
    }
}

startClient();