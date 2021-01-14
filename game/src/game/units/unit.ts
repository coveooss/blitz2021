import { Position, isAdjacent, equal, toString } from "../position";
import { v4 as uuid } from 'uuid';
import { UnitError } from "../error";
import { Crew } from "../crews/crew";
import { TickCrewUnit, UnitType } from "../types";
import { UNIT } from "../config";

export abstract class Unit {
    public readonly id: string

    public blitzium = 0;
    public maxBlitzium = 0;
    public path: Position[] = []

    constructor(public crew: Crew, public position: Position, public type: UnitType) {
        this.id = uuid();
        this.crew.units.push(this);
    }

    public kill() {
        this.crew.units.splice(this.crew.units.indexOf(this), 1);
        if (this.blitzium !== 0) {
            this.crew.game.map.depots.push({ position: this.position, blitzium: this.blitzium });
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

        if (this.path.length > 0 && equal(target, this.path[this.path.length - 1])) {
            let newPosition = this.path[0];

            if (!this.crew.game.getUnitAtPosition(newPosition)) {
                this.position = newPosition;
                this.path = this.path.slice(1);
                return;
            }
        }

        const map = this.crew.game.map;
        if (!map.isInBound(target) || map.getTile(target).type !== 'EMPTY') {
            throw new UnitError(this, `Target destination is not walkable: ${toString(target)}`);
        }

        if (this.crew.game.isTooCloseToEnemyBase(target, this.crew.id)) {
            throw new UnitError(this, `Target is too close to an enemy base: ${toString(target)}`);
        }

        if (this.crew.game.getUnitAtPosition(target)) {
            throw new UnitError(this, `A unit is already on that location: ${toString(target)}`);
        }

        const result = this.crew.game.computePathForUnitTo(this, target);
        if (result.status === "noPath" || result.status === "timeout") {
            throw new UnitError(this, `No path to ${toString(target)}`);
        }

        this.path = result.path;
        this.position = this.path[1];
        this.path = this.path.slice(2);
    }

    public attack(target: Position) {
        const enemy = this.crew.game.getUnitAtPosition(target);

        if (isAdjacent(target, this.position) && enemy && enemy.crew !== this.crew) {
            if (this.crew.blitzium < UNIT.OUTLAW_COST_OF_ATTACKING) {
                throw new UnitError(this, `There's not enough Blitizum to pay the Outlaw to attack!`);
            }

            enemy.kill();
            this.crew.blitzium = this.crew.blitzium - UNIT.OUTLAW_COST_OF_ATTACKING;

            let odds = enemy.type === "OUTLAW" ? UNIT.OUTLAW_SURVIVAL_X_OUTLAW : UNIT.OUTLAW_SURVICAL_X_OTHER;
            if (Math.random() >= odds) {
                this.kill();
            }

            return;
        }

        throw new UnitError(this, `There's no enemy near by to attack!`);
    }

    public mine(target: Position) {
        const mine = this.crew.game.map.mines.find(m => equal(target, m.position));

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
            throw new UnitError(this, `Target is not nearby`);
        }

        const unit = this.crew.getUnitAtPosition(target);
        const depot = this.crew.game.map.depots.find(d => equal(target, d.position));

        const targetObject = unit || depot;

        if (targetObject) {
            let availableCargo = this.maxBlitzium - this.blitzium;
            let blitziumToTake = Math.min(targetObject.blitzium, availableCargo);

            targetObject.blitzium = Math.max(targetObject.blitzium - blitziumToTake, 0);
            this.blitzium = this.blitzium + blitziumToTake;
        } else {
            throw new UnitError(this, 'Target is invalid, no depot or friendly unit');
        }

        if (depot && depot.blitzium <= 0) {
            this.crew.game.map.depots.splice(this.crew.game.map.depots.indexOf(depot), 1);
        }
    }

    public drop(target: Position) {
        if (isAdjacent(target, this.position)) {
            if (this.blitzium === 0) {
                throw new UnitError(this, `Unit is empty, nothing to drop`);
            }

            if (equal(target, this.crew.homeBase)) {
                this.crew.dropBlitzium(this.blitzium);
                this.blitzium = 0;
            } else {
                const unit = this.crew.getUnitAtPosition(target);
                const existingDepot = this.crew.game.map.depots.find(d => equal(target, d.position));

                if (unit) {
                    const maxCargoSpace = unit.maxBlitzium - unit.blitzium;
                    const amountToDrop = Math.min(maxCargoSpace, this.blitzium);

                    unit.blitzium = unit.blitzium + amountToDrop;
                    this.blitzium = this.blitzium - amountToDrop;
                } else if (existingDepot) {
                    existingDepot.blitzium = existingDepot.blitzium + this.blitzium;
                    this.blitzium = 0;
                } else if (this.crew.game.map.getTile(target).type === 'EMPTY') {
                    this.crew.game.map.depots.push({ position: target, blitzium: this.blitzium });
                    this.blitzium = 0;
                } else {
                    throw new UnitError(this, `Invalid location for a depot ${target}`);
                }
            }
        } else {
            throw new UnitError(this, `Invalid location for a depot ${target}`);
        }
    }

    public serialize(): TickCrewUnit {
        return {
            id: this.id,
            type: this.type,
            blitzium: this.blitzium,
            position: this.position,
            path: this.path
        }
    }
}