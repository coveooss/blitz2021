import { Server } from './server/server'
import { Game } from './game/game';

(async () => {
    const game = new Game({ timeMsAllowedPerTicks: 1000, numberOfTicks: 1000, maxWaitTimeMsBeforeStartingGame: 5000 });
    const server = new Server(3000, game);

    await server.listen();
})();

import { GameMap } from './game/map';

const gameMap = GameMap.fromFile("maps/test.bmp");