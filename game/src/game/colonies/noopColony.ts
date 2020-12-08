import { Colony } from "./colony";
import { Game } from "../game";
import { PlayerTick } from '../types';

export class NoopColony extends Colony {
    constructor(game: Game) {
        super(game)

        this.init("NoopColony");
    }

    public async getNextCommand(tick: PlayerTick): Promise<any> {
        return { type: "COMMAND", tick: tick.tick };
    }
}