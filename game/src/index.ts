import { Server } from './server/server'
import { Game } from './game/game';
import { Recorder, RecorderMode } from './recorder/recorder';
import yargs from 'yargs';
import { logger } from './logger';

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
        'gameStartTimeoutMs': { type: 'number', default: 500000 },
        'nbOfColonies': { type: 'number', default: 1 },
        'recordPath': { type: 'string' },
        's3Bucket': { type: 'string' },
        's3Path': { type: 'string' },
        'keepAlive': { type: 'boolean', default: true },
        'teamNamesByToken': { type: 'string' },
        'serveUi': { type: 'boolean', default: true }
    })
    .env(true)
    .argv;

(async () => {
    do {
        const game = new Game({
            timeMsAllowedPerTicks: args.timePerTickMs,
            numberOfTicks: args.nbOfTicks,
            maxWaitTimeMsBeforeStartingGame: args.gameStartTimeoutMs,
            expectedNumberOfColonies: args.nbOfColonies
        });

        const teamNamesByToken = args.teamNamesByToken ? JSON.parse(args.teamNamesByToken) : null;
        const recorder = new Recorder(game, RecorderMode.Command);
        const server = new Server(8765, game, args.serveUi, teamNamesByToken);

        await server.listen();

        logger.info('Game finished, saving state');

        if (args.recordPath) {
            logger.info(`Saving state file to ${args.recordPath}`);
            recorder.saveToFile(args.recordPath);
        }

        if (args.s3Bucket && args.s3Path) {
            logger.info(`Saving state file to S3 ${args.s3Bucket}/${args.s3Path}`);
            recorder.saveToS3(args.s3Bucket, args.s3Path);
        }
    } while (args.keepAlive);
})();