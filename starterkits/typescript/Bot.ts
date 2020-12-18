import { MOVES, IGameTick, GameMessage } from "./GameInterface";



export class Bot {
  constructor() {
    // This method should be use to initialize some variables you will need throughout the game.
  }

  getNextMove(gameMessage: GameMessage) {
    // Here is where the magic happens, for now the moves are random. I bet you can do better ;)
    
    const POSSIBLE_MOVES = this.getLegalMovesForCurrentTick(gameMessage);
    return POSSIBLE_MOVES[Math.floor(Math.random() * POSSIBLE_MOVES.length)];
  }

  getLegalMovesForCurrentTick(gameMessage: GameMessage) {
    // You should define here what moves are legal for your current position and direction so that your bot does not send a lethal move

    // Your bot moves are done according to its direction, if you are in the DOWN direction.
    // A TURN_RIGHT move will make your bot move left in the map visualization (replay or logs)
    let me = gameMessage.getPlayerMapById().get(gameMessage.game.player_id);


    return Object.values(MOVES);
  }
}
