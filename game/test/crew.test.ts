import { Game } from '../src/game/game';
import { Crew } from '../src/game/crews/crew';
import { Command, CommandAction, PlayerTick } from '../src/game/types';
import { Unit } from '../src/game/units/unit';
import { NoopCrew } from '../src/game/crews/noopCrew';

const EXPECTED_CREW_ID = 'test-id';
const EXPECTED_CREW_NAME = 'test-name';

class TestCrew extends Crew {
    constructor(public game: Game) {
        super(game, EXPECTED_CREW_NAME);
        this.id = EXPECTED_CREW_ID;
        this.homeBase = { x: 11, y: 24 };
    }

    async getNextCommand(tick: PlayerTick): Promise<Command> {
        return Promise.reject();
    }
}

class TestUnit extends Unit { }

describe('Crew', () => {
    let myCrew: Crew;
    let units: Unit[];

    beforeEach(() => {

        myCrew = new NoopCrew(new Game());
        myCrew.homeBase = { x: 0, y: 5 };
        units = [
            new TestUnit(myCrew, { x: 0, y: 0 }, 'MINER'),
            new TestUnit(myCrew, { x: 0, y: 1 }, 'MINER'),
            new TestUnit(myCrew, { x: 0, y: 2 }, 'MINER')
        ];
    });

    describe('buy unit', () => {
        it('should throw if there is not enough blitzium available', () => {
            myCrew.blitzium = 0;
            expect(() => myCrew.buyUnit({ type: 'BUY', unitType: 'CART' })).toThrowError();
        });

        it('should add the unit to the crew with the proper cost', () => {
            myCrew.blitzium = myCrew.getUnitPrices().CART;

            expect(myCrew.units.length).toBe(3);
            myCrew.buyUnit({ type: 'BUY', unitType: 'CART' });

            expect(myCrew.units.length).toBe(4);
            expect(myCrew.units[3].type).toBe('CART');
            expect(myCrew.units[3].position).toEqual(myCrew.homeBase);

            expect(myCrew.blitzium).toBe(0);
        });

        it('should throw if there is a unit at the home base', () => {
            myCrew.blitzium = myCrew.getUnitPrices().CART;
            myCrew.units[0].position = myCrew.homeBase;

            expect(myCrew.units.length).toBe(3);
            expect(() => myCrew.buyUnit({ type: 'BUY', unitType: 'CART' })).toThrowError();
            expect(myCrew.units.length).toBe(3);
            expect(myCrew.blitzium).toBe(myCrew.getUnitPrices().CART);
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

            myCrew.applyCommand({
                actions: [action, action]
            });

            expect(myCrew.errors.length).toBe(1);
            expect(targetUnit.move).toHaveBeenCalledTimes(1);
            expect(targetUnit.move).toHaveBeenCalledWith(target);
        });
        it('should add error if the unit id is not found', () => {

            myCrew.applyCommand({
                actions: [
                    {
                        type: 'UNIT',
                        action: 'MOVE',
                        target: { x: 0, y: 0 },
                        unitId: 'INVALID_ID_123'
                    }
                ]
            });


            expect(myCrew.errors.length).toBe(1);
        });

        it('should send the move command to the proper unit', () => {
            let targetUnit = units[1];
            let target = { x: 0, y: 2 };

            targetUnit.move = jest.fn();

            myCrew.applyCommand({
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

            myCrew.applyCommand({
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

            myCrew.applyCommand({
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

            myCrew.applyCommand({
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
            myCrew.blitzium = 1000000;

            expect(myCrew.units.length).toBe(3);

            myCrew.applyCommand({
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

            expect(myCrew.units.length).toBe(4);
            expect(myCrew.errors.length).toBe(1);
        });
    });

    describe('serialize', () => {
        it('should serialize its default state', () => {
            const crew = new TestCrew(new Game());

            expect(crew.serialize()).toStrictEqual({
                id: EXPECTED_CREW_ID,
                name: EXPECTED_CREW_NAME,
                errors: [],
                homeBase: { x: 11, y: 24 },
                safeZoneRadius: 3,
                blitzium: 0,
                units: [],
                totalBlitzium: 0,
                prices: crew.getUnitPrices()
            });
        });

        it.todo('serialize units');
        it.todo('serialize errors');
        it.todo('serialize the correct amount of blitzium');
    });
});