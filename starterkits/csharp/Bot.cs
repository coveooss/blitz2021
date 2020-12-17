using System;
using System.Collections.Generic;
using System.Linq;
using static GameCommand;
using static GameCommand.UnitAction;
using static Map;

namespace Blitz2020
{
    public class Bot
    {
        public static string NAME = "MyBot C#";

        public Bot()
        {
            // initialize some variables you will need throughout the game here
        }

        public GameCommand nextMove(GameMessage gameMessage)
        {
            Colony myColony = gameMessage.getColoniesMapById[gameMessage.colonyId];
            int mapSize = gameMessage.map.getMapSize();


            List<GameCommand.Action> actions = myColony.units
                .Select(c => new UnitAction(UnitActionType.MOVE, c.id, this.getRandomPosition(mapSize)))
                .ToList<GameCommand.Action>();

            return new GameCommand(actions);
        }

        public Position getRandomPosition(int size)
        {
            Random rand = new Random();
            return new Position(rand.Next(size), rand.Next(size));
        }
    }
}