import { GameMessage, Action, IPosition } from "./GameInterface";



export class Bot {
  constructor() {
    // This method should be use to initialize some variables you will need throughout the game.
  }

  /*
  * Here is where the magic happens, for now the moves are random. I bet you can do better ;)
  *
  * No path finding is required, you can simply send a destination per unit and the game will move your unit towards
  * it in the next turns.
  */
  getNextMove(gameMessage: GameMessage): Action[] {

    const myColony = gameMessage.getPlayerMapById().get(gameMessage.colonyId);
    const randomPosition: IPosition = {
      x: Math.round(Math.random() * gameMessage.getMapSize()),
      y: Math.round(Math.random() * gameMessage.getMapSize())
    };

    return myColony.units.map(unit => ({
      action: 'MOVE',
      target: randomPosition,
      type: 'UNIT',
      unitId: unit.id
    }));
  }
}
