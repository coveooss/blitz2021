import fs from 'fs';
import AWS from 'aws-sdk';
import zlib from 'zlib';
import { Game, GameResult } from '../game/game';
import { logger } from '../logger';
import { Tick } from '../game/types';

export enum RecorderMode {
    Tick = 'tick',
    Command = 'command'
}

export class Recorder {
    public saveToFile(path: string,) {
        fs.writeFileSync(path, JSON.stringify(this.buffer, null, 2));
    }

    public saveToS3(bucket: string, path: string) {
        const GAME_LOG = 'game_logs.txt';
        const s3 = new AWS.S3();

        let params = {
            Bucket: bucket,
            Key: `${path}gameResults.json`,
            Body: JSON.stringify(this.gameResults)
        };

        s3.upload(params, function (err: any, data: any) {
            if (err) {
                throw err;
            }

            logger.info(`Game results uploaded successfully. ${data.Location}`);
        });


        if (fs.existsSync(GAME_LOG)) {
            params = {
                Bucket: bucket,
                Key: `${path}${GAME_LOG}`,
                Body: fs.readFileSync(GAME_LOG).toString('utf8')
            };

            s3.upload(params, function (err: any, data: any) {
                if (err) {
                    throw err;
                }

                logger.info(`Game logs uploaded successfully. ${data.Location}`);
            });
        } else {
            logger.warn('No game logs found to upload');
        }



        zlib.gzip(Buffer.from(JSON.stringify(this.buffer), 'utf-8'), (err, result) => {
            if (err) {
                logger.error(err);
            }

            var paramsReplay = {
                Bucket: bucket,
                Key: `${path}replay.gz`,
                Body: result,
                ContentType: 'text/plain',
                ContentEncoding: 'gzip'
            };

            s3.upload(paramsReplay, function (err: any, data: any) {
                if (err) {
                    logger.error(err);
                }

                logger.info(`Replay uploaded successfully. ${data.Location}`);
            });
        });

    }

    public buffer: Tick[] = [];
    private gameResults: GameResult[];

    constructor(private game: Game, private recordingMode: RecorderMode) {

        if (recordingMode === RecorderMode.Command) {
            this.game.onCommand(() => this.onChange());
        } else {
            this.game.onTick(() => this.onChange());
        }

        this.game.onGameCompleted((gameResults) => {
            this.gameResults = gameResults;
        });
    }

    private onChange() {
        const state = this.game.serialize();
        logger.debug(`Recording state ${JSON.stringify(state)})`);
        this.buffer.push(state);
    }
}
