import { Colony } from "./colony";
import { Game } from "../game";
import { timeoutAfter } from "../../utils";

export class NoopColony extends Colony {
    constructor(game: Game) {
        super(game)

        this.init("NoopColony");
    }

    public async getNextCommand(tick: any): Promise<any> {
        return { type: "COMMAND", tick: tick.tick };
    }
}