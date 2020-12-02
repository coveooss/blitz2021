import { Server } from './server/server'
import { Game } from './game/game';
import yargs from 'yargs';

const splash = ` ______   _       __________________ _______  _______  _______  _______  __   
(  ___ \\ ( \\      \\__   __/\\__   __// ___   )/ ___   )(  __   )/ ___   )/  \\  
| (   ) )| (         ) (      ) (   \\/   )  |\\/   )  || (  )  |\\/   )  |\\/) ) 
| (__/ / | |         | |      | |       /   )    /   )| | /   |    /   )  | | 
|  __ (  | |         | |      | |      /   /   _/   / | (/ /) |  _/   /   | | 
| (  \\ \\ | |         | |      | |     /   /   /   _/  |   / | | /   _/    | | 
| )___) )| (____/\\___) (___   | |    /   (_/\\(   (__/\\|  (__) |(   (__/\\__) (_
|/ \\___/ (_______/\\_______/   )_(   (_______/\\_______/(_______)\\_______/\\____/
                                                                             
`;
console.log(splash);

const args = yargs(process.argv.slice(2))
    .options({
        'timePerTickMs': { type: 'number', default: 1000 },
        'nbOfTicks': { type: 'number', default: 1000 },
        'gameStartTimoutMs': { type: 'number', default: 500000 },
        'nbOfColonies': { type: 'number', default: 3 }
    }).argv;

(async () => {
    const game = new Game({
        timeMsAllowedPerTicks: args.timePerTickMs,
        numberOfTicks: args.nbOfTicks,
        maxWaitTimeMsBeforeStartingGame: args.gameStartTimoutMs,
        expectedNumberOfColonies: args.nbOfColonies
    });

    const server = new Server(3000, game);
    await server.listen();
})();