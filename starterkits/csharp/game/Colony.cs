using System.Collections.Generic;
using static Map;

public class Colony
{
    public string id;
    public string name;
    public Position homeBase;
    public Position spawnPoint;
    public int blitzium;
    public int totalBlitzium;
    public List<Unit> units;
    public List<string> errors;
}

public class Unit
{
    public enum UnitType
    {
        MINER, CART, COWBOY
    }

    public string id;
    public UnitType type;
    public int blitzium;
    public Position position;
    public List<Position> path;
}