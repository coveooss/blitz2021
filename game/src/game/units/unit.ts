import { Position, isAdjacent, equal, toString } from "../position";
import { v4 as uuid } from 'uuid';
import { UnitError } from "../error";
import { Colony } from "../colonies/colony";
import { TickColonyUnit, UnitType } from "../types";

export abstract class Unit {
    public readonly id: string

    public blitzium = 0;
    public maxBlitzium = 0;
    public path: Position[] = []

    constructor(private colony: Colony, public position: Position, protected type: UnitType) {
        this.id = uuid();
        this.colony.units.push(this);
    }

    public kill() {
        this.colony.units.splice(this.colony.units.indexOf(this), 1);
        if (this.blitzium !== 0) {
            this.colony.game.map.depots.push({ position: this.position, blitzium: this.blitzium });
        }
    }

    public toString() {
        return `([${this.type}] ${this.id} ${JSON.stringify(this.position)})`
    }

    public move(target: Position) {
        if (equal(this.position, target)) {
            this.path = [];
            return;
        }

        if (this.path.length === 0 || !equal(target, this.path[this.path.length - 1])) {
            const map = this.colony.game.map;
            const result = map.computePath(this.position, target);
            if (result.status === "noPath" || result.status === "timeout") {
                throw new UnitError(this, `No path to ${toString(target)}`);
            }

            this.path = result.path;
        }

        if (this.path) {
            this.position = this.path[1];
            this.path.splice(0, 2);
        }
    }

    public attack(target: Position) {
        const enemy = this.colony.game.getUnitAtPosition(target);

        if (isAdjacent(target, this.position) && enemy && enemy.colony !== this.colony) {
            enemy.kill();
            return;
        }

        throw new UnitError(this, `There's no enemy near by to attack!`);
    }

    public mine(target: Position) {
        const mine = this.colony.game.map.mines.find(m => equal(target, m.position));

        if (this.blitzium + 1 > this.maxBlitzium) {
            throw new UnitError(this, `This unit is full already and can't take more blitzium!`);
        }

        if (isAdjacent(target, this.position) && mine) {
            this.blitzium = this.blitzium + 1;
            return;
        }

        throw new UnitError(this, `There's no mine near by to mine from!`);
    }

    public pickup(target: Position, amount: number) {
        const depot = this.colony.game.map.depots.find(d => equal(target, d.position));

        if (isAdjacent(target, this.position) && depot) {
            this.blitzium = this.blitzium + 1;
            return;
        }

        if (this.blitzium + amount > this.maxBlitzium) {
            throw new UnitError(this, `Not enough space for ${amount} blitzium!`);
        }

        if (depot.blitzium <= amount) {
            throw new UnitError(this, `Depot isn't big enough to pickup ${amount} blitzium from!`);
        }

        depot.blitzium = depot.blitzium - amount;
        this.blitzium = this.blitzium + amount;

        if (depot.blitzium <= 0) {
            this.colony.game.map.depots.splice(this.colony.game.map.depots.indexOf(depot), 1);
        }
    }

    public drop(target: Position) {
        if (isAdjacent(target, this.position)) {
            if (equal(target, this.colony.homeBase)) {
                this.colony.dropBlitzium(this.blitzium);
                this.blitzium = 0;
            }
        }
    }

    public serialize(): TickColonyUnit {
        return {
            id: this.id,
            type: this.type,
            blitzium: this.blitzium,
            position: this.position,
            path: this.path
        }
    }
}