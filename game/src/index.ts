import yargs from 'yargs';
import fs from 'fs';

import { Server } from './server/server'
import { Game } from './game/game';
import { Recorder, RecorderMode } from './recorder/recorder';
import { logger } from './logger';
import { GameMap } from './game/map';

const splash = ` ______   _       __________________ _______      _______  _______  _______  __   
(  ___ \\ ( \\      \\__   __/\\__   __// ___   )    / ___   )(  __   )/ ___   )/  \\  
| (   ) )| (         ) (      ) (   \\/   )  |    \\/   )  || (  )  |\\/   )  |\\/) ) 
| (__/ / | |         | |      | |       /   )_____   /   )| | /   |    /   )  | | 
|  __ (  | |         | |      | |      /   /(_____)_/   / | (/ /) |  _/   /   | | 
| (  \\ \\ | |         | |      | |     /   /       /   _/  |   / | | /   _/    | | 
| )___) )| (____/\\___) (___   | |    /   (_/\\    (   (__/\\|  (__) |(   (__/\\__) (_
|/ \\___/ (_______/\\_______/   )_(   (_______/    \\_______/(_______)\\_______/\\____/
                                                                                 
`;
const MAP_FILE_FOLDER = './maps/';

const args = yargs(process.argv.slice(2))
    .options({
        'timePerTickMs': { type: 'number', default: 1000, description: "Max time the game will wait for a tick" },
        'delayBetweenTicksMs': { type: 'number', default: 150, description: "Time to wait between ticks" },
        'nbOfTicks': { type: 'number', default: 1000, description: "Number of tick to play" },
        'gameStartTimeoutMs': { type: 'number', default: 500000, description: "Delay before starting the game" },
        'nbOfCrews': { type: 'number', description: "Number of crews to expect before starting the game" },
        'recordPath': { type: 'string', description: "File path to record replay to" },
        's3Bucket': { type: 'string' },
        's3Path': { type: 'string' },
        'keepAlive': { type: 'boolean', default: true, description: "Indicates if the game should close or restart on completion" },
        'teamNamesByToken': { type: 'string' },
        'serveUi': { type: 'boolean', default: true },
        'gameConfig': { type: 'string', description: "Map configuration", default: '2P-01.bmp' }
    })
    .version(process.env.VERSION || 'DEV')
    .command('list-maps', 'List all the available maps', () => {
        let files = fs.readdirSync(MAP_FILE_FOLDER);
        console.log("Here's the maps you can use, add the --gameConfig=[MAP] option to change the default.");
        files.forEach(f => {
            console.log(`\t - ${f}`);
        });

        process.exit();
    })
    .command("validate-maps", "Validate all the available maps", () => {
        let files = fs.readdirSync(MAP_FILE_FOLDER);
        files.forEach((f) => {
            try {
                GameMap.fromFile(MAP_FILE_FOLDER + f);
            } catch (error) {
                console.log(`\t - ${f} - Invalid - `, error);
                return;
            }
            console.log(`\t - ${f} - Valid`);
        });

        process.exit();
    })
    .env(true)
    .example([
        ["docker run [...]", "Run server with default map"],
        ["docker run [...] --nbOfCrews=1 --gameConfig=2P-01.bmp", "Run server with custom map and custom number of crews"],
        ["docker run [...] list-maps", "List the names of all available maps"]
    ])
    .scriptName("docker run [...]")
    .argv;

console.log(splash);

(async () => {
    do {
        const game = new Game({
            timeMsAllowedPerTicks: args.timePerTickMs,
            numberOfTicks: args.nbOfTicks,
            maxWaitTimeMsBeforeStartingGame: args.gameStartTimeoutMs,
            expectedNumberOfCrews: args.nbOfCrews,
            gameMapFile: args.gameConfig ? MAP_FILE_FOLDER + args.gameConfig : null,
            delayMsBetweenTicks: args.delayBetweenTicksMs
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