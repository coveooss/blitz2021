import { GameMessage, Action, IPosition } from "./GameInterface";



export class Bot {
  constructor() {
    // This method should be use to initialize some variables you will need throughout the game.
  }

  getNextMove(gameMessage: GameMessage): Action[] {
    // Here is where the magic happens, for now the moves are random. I bet you can do better ;)

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
