import * as React from 'react';
import {Circle, Group} from 'react-konva';

import {Size, GAP_RATIO, VisualizationContext, colors} from '../constants';
import {TickColony} from 'blitz2021/dist/game/types';

const SpawnPoints: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const bases = currentTick?.colonies?.map((colony: TickColony, i) => {
        if (!colony.spawnPoint) {
            return null;
        }

        const {x, y} = colony.spawnPoint;
        return (
            <Circle
                key={`base-${i}`}
                fill={colors[i]}
                x={x * Size.Tile}
                y={y * Size.Tile}
                shadowColor="rgb(45,41,38)"
                shadowOffset={{x: (-GAP_RATIO / 2) * Size.InnerTile, y: (GAP_RATIO / 2) * Size.InnerTile}}
                shadowOpacity={0.3}
                radius={Size.InnerTile / 4}
            />
        );
    });

    return (
        <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}}>
            {bases}
        </Group>
    );
};
export default SpawnPoints;
