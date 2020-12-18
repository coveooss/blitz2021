import * as React from 'react';
import {Group, Rect} from 'react-konva';
import {VisualizationContext} from '../constants';

const Background: React.FunctionComponent = () => {
    const {boardSize} = React.useContext(VisualizationContext);

    return (
        <Group x={0} y={0}>
            <Rect fill="#0E251B" width={boardSize} height={boardSize} />
        </Group>
    );
};
export default Background;
