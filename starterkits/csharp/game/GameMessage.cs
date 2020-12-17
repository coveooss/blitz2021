using System.Collections.Generic;
using System.Linq;

namespace Blitz2020
{
    public class GameMessage
    {
        public int tick;

        public int totalTick;

        public string colonyId;
        public List<Colony> colonies;

        public Map map;

        public Dictionary<string, Colony> getColoniesMapById
        {
            get { return this.colonies.ToDictionary(p => p.id, p => p); }
        }
    }
}