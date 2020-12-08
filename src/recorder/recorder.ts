import fs from 'fs';
import { Game } from '../game/game';
import { logger } from '../logger';
import { Tick } from '../game/types';

export enum RecorderMode {
    Tick = 'tick',
    Command = 'command'
}

export class Recorder {
    public static saveToFile(path: string, object: any) {
        fs.writeFileSync(path, JSON.stringify(object, null, 2));
    }

    public buffer: Tick[] = [];

    constructor(private game: Game, private recordingMode: RecorderMode) {
        if (recordingMode === RecorderMode.Command) {
            this.game.onCommand(() => this.onChange());
        } else {
            this.game.onTick(() => this.onChange());
        }
    }

    private onChange() {
        const state = this.game.serialize();
        logger.debug(`Recording state ${JSON.stringify(state)})`);
        this.buffer.push(state);
    }
}
