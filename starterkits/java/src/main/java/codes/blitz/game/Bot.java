package codes.blitz.game;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import codes.blitz.game.message.game.Action;
import codes.blitz.game.message.game.ActionType;
import codes.blitz.game.message.game.Colony;
import codes.blitz.game.message.game.GameMap;
import codes.blitz.game.message.game.GameMessage;
import codes.blitz.game.message.game.Position;
import codes.blitz.game.message.game.UnitAction;
import codes.blitz.game.message.game.UnitActionType;

public class Bot
{
    private static final Random random = new Random();

    public Bot()
    {
        // initialize some variables you will need throughout the game here
    }

    public List<Action> getNextActions(GameMessage gameMessage)
    {
        // Here is where the magic happens, for now the moves are random. I bet you can do better ;)

        Colony myColony = gameMessage.getColoniesMapById().get(gameMessage.getColonyId());
        int mapSize = gameMessage.getGameMap().getMapSize();


        List<Action> actions =
            myColony
                .getUnits()
                .stream()
                .map(unit -> new UnitAction(UnitActionType.MOVE, unit.getId(), getRandomPosition(mapSize)))
                .collect(Collectors.toList());


        // You can print out a pretty version of the map but be aware that
        // printing out long strings can impact your bot performance (30 ms in average).
        // System.out.println(gameMessage.getGame().getPrettyMap());

        return actions;

    }

    public Position getRandomPosition(int size)
    {
        Random rand = new Random();
        return new Position(rand.nextInt(size), rand.nextInt(size));
    }
}
