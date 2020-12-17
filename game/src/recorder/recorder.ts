import fs from 'fs';
import AWS from 'aws-sdk';
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

        params = {
            Bucket: bucket,
            Key: `${path}replay.json`,
            Body: JSON.stringify(this.buffer)
        };

        s3.upload(params, function (err: any, data: any) {
            if (err) {
                throw err;
            }

            logger.info(`Replay uploaded successfully. ${data.Location}`);
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
