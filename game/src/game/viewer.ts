import { Game } from "./game";
import { Tick } from "./types";

export abstract class Viewer {
    constructor(protected game: Game) { }
    public abstract onTick(tick: Tick): void;
}