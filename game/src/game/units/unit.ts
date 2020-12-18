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


        const map = this.colony.game.map;
        const result = map.computePath(this.position, target, this.colony.game);
        if (result.status === "noPath" || result.status === "timeout") {
            throw new UnitError(this, `No path to ${toString(target)}`);
        }

        this.path = result.path;
        this.position = this.path[1];
        this.path = this.path.slice(2);
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

    public pickup(target: Position) {
        if (!isAdjacent(target, this.position)) {
            throw new UnitError(this, `Target is not near by`);
        }

        const unit = this.colony.getUnitAtPosition(target) || this.colony.game.map.depots.find(d => equal(target, d.position));

        if (unit) {
            let availableCargo = this.maxBlitzium - this.blitzium;
            let blitziumToTake = Math.min(unit.blitzium, availableCargo);

            unit.blitzium = Math.max(unit.blitzium - blitziumToTake, 0);
            this.blitzium = this.blitzium + blitziumToTake;
            return;
        }

        if (unit.blitzium <= 0 && this.colony.game.map.depots.includes(unit)) {
            this.colony.game.map.depots.splice(this.colony.game.map.depots.indexOf(unit), 1);
        }
    }

    public drop(target: Position) {
        if (isAdjacent(target, this.position)) {
            if (equal(target, this.colony.homeBase)) {
                this.colony.dropBlitzium(this.blitzium);
                this.blitzium = 0;
            } else {
                const existingDepot = this.colony.game.map.depots.find(d => equal(target, d.position));
                if (existingDepot) {
                    existingDepot.blitzium = existingDepot.blitzium + this.blitzium;
                    this.blitzium = 0;
                } else if (this.colony.game.map.getTile(target).type === 'EMPTY') {
                    this.colony.game.map.depots.push({ position: target, blitzium: this.blitzium });
                    this.blitzium = 0;
                } else {
                    throw new UnitError(this, `Invalid location for a depot ${target}`);
                }
            }
        } else {
            throw new UnitError(this, `Invalid location for a depot ${target}`);
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