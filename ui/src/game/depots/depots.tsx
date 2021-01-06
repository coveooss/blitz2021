import * as React from 'react';
import {Group, Path} from 'react-konva';

import {Size, VisualizationContext} from '../../constants';
import Blitzium from '../tiles/blitzium';

const Depots: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const depots = currentTick?.map?.depots?.map((depot, i) =>
            {
                const {y, x} = depot.position;
                return (
                <Group key={`depot-${i}`}>
                    <Blitzium x={x + 0.05} y={y + 0.05} scale={0.4}/>
                    <Blitzium x={x + 0.55} y={y + 0.55} scale={0.4}/>
                </Group>
            );
        });
    return (
        <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}}>
            {depots}
        </Group>
    );
};

export default Depots;
