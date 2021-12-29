import { Crew } from "./crew";
import { Game } from "../game";
import { PlayerTick } from '../types';

export class NoopCrew extends Crew {
    constructor(game: Game) {
        super(game, 'Noop');
    }

    public async getNextCommand(tick: PlayerTick): Promise<any> {
        return { type: "COMMAND", tick: tick.tick };
    }
}