import { Server } from './server/server'
import { Game } from './game/game';
import { Recorder, RecorderMode } from './recorder/recorder';
import yargs from 'yargs';

const splash = ` ______   _       __________________ _______      _______  _______  _______  __   
(  ___ \\ ( \\      \\__   __/\\__   __// ___   )    / ___   )(  __   )/ ___   )/  \\  
| (   ) )| (         ) (      ) (   \\/   )  |    \\/   )  || (  )  |\\/   )  |\\/) ) 
| (__/ / | |         | |      | |       /   )_____   /   )| | /   |    /   )  | | 
|  __ (  | |         | |      | |      /   /(_____)_/   / | (/ /) |  _/   /   | | 
| (  \\ \\ | |         | |      | |     /   /       /   _/  |   / | | /   _/    | | 
| )___) )| (____/\\___) (___   | |    /   (_/\\    (   (__/\\|  (__) |(   (__/\\__) (_
|/ \\___/ (_______/\\_______/   )_(   (_______/    \\_______/(_______)\\_______/\\____/
                                                                                 
`;
console.log(splash);

const args = yargs(process.argv.slice(2))

    .options({
        'timePerTickMs': { type: 'number', default: 1000 },
        'nbOfTicks': { type: 'number', default: 1000 },
        'gameStartTimoutMs': { type: 'number', default: 500000 },
        'nbOfColonies': { type: 'number', default: 1 },
        'recordPath': { type: 'string' },
        's3_bucket': { type: 'string' },
        's3_path': { type: 'string' },
        'keepAlive': { type: 'boolean', default: true },
    })
    .env('BLITZ')
    .argv;

console.log(args.test);
(async () => {
    do {
        const game = new Game({
            timeMsAllowedPerTicks: args.timePerTickMs,
            numberOfTicks: args.nbOfTicks,
            maxWaitTimeMsBeforeStartingGame: args.gameStartTimoutMs,
            expectedNumberOfColonies: args.nbOfColonies
        });

        const recorder = new Recorder(game, RecorderMode.Command);
        const server = new Server(8765, game, true);

        await server.listen();

        if (args.recordPath) {
            Recorder.saveToFile(args.recordPath, recorder.buffer);
        }

        if (args.s3_bucket && args.s3_path) {
            Recorder.saveToS3(args.s3_bucket, args.s3_path, recorder.buffer);
        }
    } while (args.keepAlive);
})();