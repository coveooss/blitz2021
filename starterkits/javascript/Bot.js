const Game = require('./GameInterface');

// Here are some command exemple to get you started.
let buyActionExemple = { type: Game.ActionType.Buy, unitType: Game.UnitType.Miner };
let unitActionExemple = { type: Game.ActionType.Unit, target: { x: 0, y: 0 }, unitId: 'ID', type: Game.UnitActionType.Move }

class Bot {
    constructor() {
        // This method should be use to initialize some variables you will need throughout the game.
    }

    /**
     * 
     * @param {Game.GameMessage} gameMessage 
     */
    getNextMove(gameMessage) {
        const myColony = gameMessage.colonies.find(c => c.id === gameMessage.colonyId);
        const mapSize = gameMessage.map.tiles.length;
        gameMessage.

        const randomPosition = {
            x: Math.round(Math.random() * mapSize),
            y: Math.round(Math.random() * mapSize)
        };

        return myColony.units.map(unit => ({
            action: Game.UnitActionType.Move,
            target: randomPosition,
            type: Game.ActionType.Unit,
            unitId: unit.id
        }));
    }
}

module.exports = { Bot };
