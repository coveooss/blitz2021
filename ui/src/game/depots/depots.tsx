import * as React from 'react';
import {Group} from 'react-konva';

import {Size, VisualizationContext} from '../../constants';
import Blitzium from '../tiles/blitzium';
import BlitziumCount from '../units/blitziumCount';

const Depots: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const depots = currentTick?.map?.depots
        //?.filter(({blitzium}) => blitzium > 0)
        ?.map(({blitzium, position}, i) => {
            const {y, x} = position;
            return (
                <React.Fragment key={`depot-${x}-${y}`}>
                    <Blitzium x={x + 0.05} y={y + 0.05} scale={0.4}/>
                    <Blitzium x={x + 0.55} y={y + 0.55} scale={0.4}/>
                    <BlitziumCount color="#ffd121" blitzium={blitzium} position={position}/>
                </React.Fragment>
            );
        });
    return (
        <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}}>
            {depots}
        </Group>
    );
};

export default Depots;
