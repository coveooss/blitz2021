using System.Collections.Generic;
using static Map;

public class Colony
{
    public class Prices
    {
        public int MINER;
        public int OUTLAW;
        public int CART;
    }

    public string id;
    public string name;
    public Position homeBase;
    public int blitzium;
    public int totalBlitzium;
    public List<Unit> units;
    public List<string> errors;
    public Prices prices;
}

public class Unit
{
    public enum UnitType
    {
        MINER, CART, OUTLAW
    }

    public string id;
    public UnitType type;
    public int blitzium;
    public Position position;
    public List<Position> path;
}