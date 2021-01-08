using System.Collections.Generic;
using System.Linq;
using Blitz2021;

namespace Blitz2020
{
    public class Rules {
        public int MAX_MINER_CARGO;
        public int MAX_TRANSPORTER_CARGO;
        public int MAX_MINER_MOVE_CARGO;
    }

    public class GameMessage
    {
        public int tick;

        public int totalTick;

        public string colonyId;
        public List<Colony> colonies;

        public Map map;

        public Rules rules;

        public Dictionary<string, Colony> getColoniesMapById
        {
            get { return this.colonies.ToDictionary(p => p.id, p => p); }
        }
    }
}