import * as React from 'react';
import {Group, Rect} from 'react-konva';

import {Size, GAP_RATIO, VisualizationContext, colors} from '../constants';
import {TickColony} from 'blitz2021/dist/game/types';

const Bases: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const bases = currentTick?.colonies?.map((colony: TickColony, i) => {
        const {x, y} = colony.homeBase;
        return (
            <Rect
                key={`base-${i}`}
                fill={colors[i]}
                width={Size.InnerTile}
                height={Size.InnerTile}
                x={x * Size.Tile}
                y={y * Size.Tile}
                shadowColor="rgb(45,41,38)"
                shadowOffset={{x: (-GAP_RATIO / 2) * Size.InnerTile, y: (GAP_RATIO / 2) * Size.InnerTile}}
                shadowOpacity={0.3}
            />
        );
    });

    return (
        <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}}>
            {bases}
        </Group>
    );
};
export default Bases;
