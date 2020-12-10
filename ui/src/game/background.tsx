import * as React from 'react';
import {Group, Rect} from 'react-konva';
import {VisualizationContext} from '../constants';

const Background: React.FunctionComponent = () => {
    const {boardSize} = React.useContext(VisualizationContext);

    return (
        <Group x={0} y={0}>
            <Rect fill="#212121" width={boardSize} height={boardSize} />
            <Rect
                width={boardSize}
                height={boardSize}
                fillRadialGradientStartPoint={{x: 1.5 * boardSize, y: -boardSize}}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndPoint={{x: 1.5 * boardSize, y: -boardSize}}
                fillRadialGradientEndRadius={boardSize * 2}
                fillRadialGradientColorStops={[0, 'rgba(87, 121, 153, 1)', 1, 'rgba(87,121,153,0)']}
            />
        </Group>
    );
};
export default Background;
