import { Game } from '../src/game/game';
import { Colony } from '../src/game/colonies/colony';
import { Command, CommandAction, PlayerTick } from '../src/game/types';
import { Unit } from '../src/game/units/unit';
import { NoopColony } from '../src/game/colonies/noopColony';

const EXPECTED_COLONY_ID = 'test-id';
const EXPECTED_COLONY_NAME = 'test-name';

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
        myColony.homeBase = { x: 0, y: 5 };
        units = [
            new TestUnit(myColony, { x: 0, y: 0 }, 'MINER'),
            new TestUnit(myColony, { x: 0, y: 1 }, 'MINER'),
            new TestUnit(myColony, { x: 0, y: 2 }, 'MINER')
        ];
    });

    describe('buy unit', () => {
        it('should throw if there is not enough blitzium available', () => {
            myColony.blitzium = 0;
            expect(() => myColony.buyUnit({ type: 'BUY', unitType: 'CART' })).toThrowError();
        });

        it('should add the unit to the colony with the proper cost', () => {
            myColony.blitzium = myColony.getUnitPrices().CART;

            expect(myColony.units.length).toBe(3);
            myColony.buyUnit({ type: 'BUY', unitType: 'CART' });

            expect(myColony.units.length).toBe(4);
            expect(myColony.units[3].type).toBe('CART');
            expect(myColony.units[3].position).toEqual(myColony.homeBase);

            expect(myColony.blitzium).toBe(0);
        });

        it('should throw if there is a unit at the home base', () => {
            myColony.blitzium = myColony.getUnitPrices().CART;
            myColony.units[0].position = myColony.homeBase;

            expect(myColony.units.length).toBe(3);
            expect(() => myColony.buyUnit({ type: 'BUY', unitType: 'CART' })).toThrowError();
            expect(myColony.units.length).toBe(3);
            expect(myColony.blitzium).toBe(myColony.getUnitPrices().CART);
        });
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
        it('should allow only one buy command per tick', () => {
            myColony.blitzium = 1000000;

            expect(myColony.units.length).toBe(3);

            myColony.applyCommand({
                actions: [
                    {
                        type: 'BUY',
                        unitType: 'MINER'
                    },
                    {
                        type: 'BUY',
                        unitType: 'MINER'
                    }
                ]
            });

            expect(myColony.units.length).toBe(4);
            expect(myColony.errors.length).toBe(1);
        });
    });

    describe('serialize', () => {
        it('should serialize its default state', () => {
            const colony = new TestColony(new Game());

            expect(colony.serialize()).toStrictEqual({
                id: EXPECTED_COLONY_ID,
                name: EXPECTED_COLONY_NAME,
                errors: [],
                homeBase: { x: 11, y: 24 },
                safeZoneRadius: 3,
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