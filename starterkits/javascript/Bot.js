const Game = require('./GameInterface');

// Here are some command exemple to get you started.
let buyActionExemple = { type: Game.ActionType.Buy, unitType: Game.UnitType.Miner };
let unitActionExemple = { type: Game.ActionType.Unit, target: { x: 0, y: 0 }, unitId: 'ID', type: Game.UnitActionType.Move }

class Bot {
    constructor() {
        // This method should be use to initialize some variables you will need throughout the game.
    }

    /*
    * Here is where the magic happens, for now the moves are random. I bet you can do better ;)
    *
    * No path finding is required, you can simply send a destination per unit and the game will move your unit towards
    * it in the next turns.
    * 
    * @param {Game.GameMessage} gameMessage
    */
    getNextMove(gameMessage) {
        const myCrew = gameMessage.crews.find(c => c.id === gameMessage.crewId);
        const mapSize = gameMessage.map.tiles.length;

        const randomPosition = {
            x: Math.round(Math.random() * mapSize),
            y: Math.round(Math.random() * mapSize)
        };

        return myCrew.units.map(unit => ({
            action: Game.UnitActionType.Move,
            target: randomPosition,
            type: Game.ActionType.Unit,
            unitId: unit.id
        }));
    }
}

module.exports = { Bot };
