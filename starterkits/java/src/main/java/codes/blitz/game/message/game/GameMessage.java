package codes.blitz.game.message.game;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class GameMessage
{
    private int tick;
    private int totalTick;
    private String colonyId;
    private List<Colony> colonies;
    private GameMap map;
    private Map<String, Colony> coloniesMapById;

    public int getTick() {
        return tick;
    }

    public int getTotalTick() {
        return totalTick;
    }

    public String getColonyId() {
        return colonyId;
    }

    public List<Colony> getColonies() {
        return colonies;
    }

    public GameMap getGameMap() {
        return map;
    }

    public Map<String, Colony> getColoniesMapById() {
        if(coloniesMapById == null) {
            coloniesMapById = colonies.stream().collect(Collectors.toMap(Colony::getId, Function.identity()));
        }
        return coloniesMapById;
    }


}
