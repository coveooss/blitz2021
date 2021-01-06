import { Game } from '../src/game/game';
import { Colony } from '../src/game/colonies/colony';
import { Command, CommandAction, PlayerTick } from '../src/game/types';
import { Unit } from '../src/game/units/unit';
import { NoopColony } from '../src/game/colonies/noopColony';

const EXPECTED_COLONY_ID = 'test-id';
const EXPECTED_COLONY_NAME = 'test-name';

jest.mock('../src/game/game');

class TestColony extends Colony {
    constructor(public game: Game) {
        super(game, EXPECTED_COLONY_NAME);
        this.id = EXPECTED_COLONY_ID;
        this.homeBase = { x: 11, y: 24 };
    }

    async getNextCommand(tick: PlayerTick): Promise<Command> {
        return Promise.reject();
    }
}

class TestUnit extends Unit { }

describe('Colony', () => {
    let myColony: Colony;
    let units: Unit[];

    beforeEach(() => {

        myColony = new NoopColony(new Game());
        units = [
            new TestUnit(myColony, { x: 0, y: 0 }, 'MINER'),
            new TestUnit(myColony, { x: 0, y: 1 }, 'MINER'),
            new TestUnit(myColony, { x: 0, y: 2 }, 'MINER')
        ];
    });

    describe('buy unit', () => {
        it.todo('should throw if there is not enough blitzium available');
        it.todo('should add the unit to the colony with the proper cost');
    });

    describe('apply command', () => {
        it('shoud add error if more than one command was for a single unit', () => {
            let targetUnit = units[1];
            let target = { x: 0, y: 2 };
            let action: CommandAction = {
                type: 'UNIT',
                action: 'MOVE',
                target: target,
                unitId: targetUnit.id
            }

            targetUnit.move = jest.fn();

            myColony.applyCommand({
                actions: [action, action]
            });

            expect(myColony.errors.length).toBe(1);
            expect(targetUnit.move).toHaveBeenCalledTimes(1);
            expect(targetUnit.move).toHaveBeenCalledWith(target);
        });
        it('should add error if the unit id is not found', () => {

            myColony.applyCommand({
                actions: [
                    {
                        type: 'UNIT',
                        action: 'MOVE',
                        target: { x: 0, y: 0 },
                        unitId: 'INVALID_ID_123'
                    }
                ]
            });


            expect(myColony.errors.length).toBe(1);
        });

        it('should send the move command to the proper unit', () => {
            let targetUnit = units[1];
            let target = { x: 0, y: 2 };

            targetUnit.move = jest.fn();

            myColony.applyCommand({
                actions: [
                    {
                        type: 'UNIT',
                        action: 'MOVE',
                        target: target,
                        unitId: targetUnit.id
                    }
                ]
            });

            expect(targetUnit.move).toHaveBeenCalledWith(target);
        });
        it('should send the attack command to the proper unit', () => {
            let targetUnit = units[1];
            let target = { x: 0, y: 2 };

            targetUnit.attack = jest.fn();

            myColony.applyCommand({
                actions: [
                    {
                        type: 'UNIT',
                        action: 'ATTACK',
                        target: target,
                        unitId: targetUnit.id
                    }
                ]
            });

            expect(targetUnit.attack).toHaveBeenCalledWith(target);
        });
        it('should send the pickup command to the proper unit', () => {
            let targetUnit = units[1];
            let target = { x: 0, y: 2 };

            targetUnit.pickup = jest.fn();

            myColony.applyCommand({
                actions: [
                    {
                        type: 'UNIT',
                        action: 'PICKUP',
                        target: target,
                        unitId: targetUnit.id
                    }
                ]
            });

            expect(targetUnit.pickup).toHaveBeenCalledWith(target);
        });

        it('should send the mine command to the proper unit', () => {
            let targetUnit = units[1];
            let target = { x: 0, y: 2 };

            targetUnit.mine = jest.fn();

            myColony.applyCommand({
                actions: [
                    {
                        type: 'UNIT',
                        action: 'MINE',
                        target: target,
                        unitId: targetUnit.id
                    }
                ]
            });

            expect(targetUnit.mine).toHaveBeenCalledWith(target);
        });
        it.todo('should allow only one buy command per tick');
    });

    describe('serialize', () => {
        it('should serialize its default state', () => {
            const colony = new TestColony(new Game());

            expect(colony.serialize()).toStrictEqual({
                id: EXPECTED_COLONY_ID,
                name: EXPECTED_COLONY_NAME,
                errors: [],
                homeBase: { x: 11, y: 24 },
                blitzium: 0,
                units: [],
                totalBlitzium: 0,
                prices: colony.getUnitPrices()
            });
        });

        it.todo('serialize units');
        it.todo('serialize errors');
        it.todo('serialize the correct amount of blitzium');
    });
});