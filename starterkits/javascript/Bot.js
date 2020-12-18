const UnitType = {
    Miner: 'MINER',
    Cart: 'CART',
    Outlaw: 'OUTLAW'
};

const UnitActionType = {
    Move: 'MOVE',
    Mine: 'MINE',
    None: 'NONE',
    PickUp: 'PICKUP',
    Drop: 'DROP'
};

const ActionType = {
    Buy: 'BUY',
    Unit: 'UNIT'
}

// Here are some command exemple to get you started.
let buyActionExemple = { type: ActionType.Buy, unitType: UnitType.Miner };
let unitActionExemple = { type: ActionType.Unit, target: { x: 0, y: 0 }, unitId: 'ID', action: UnitActionType.Move }

class Bot {
    constructor() {
        // This method should be use to initialize some variables you will need throughout the game.
    }

    getNextMove(gameMessage) {
        const myColony = gameMessage.colonies.find(c => c.id === gameMessage.colonyId);
        const mapSize = gameMessage.map.tiles.length;

        const randomPosition = {
            x: Math.round(Math.random() * mapSize),
            y: Math.round(Math.random() * mapSize)
        };

        return myColony.units.map(unit => ({
            action: UnitActionType.Move,
            target: randomPosition,
            type: ActionType.Unit,
            unitId: unit.id
        }));
    }
}

module.exports = { Bot };
