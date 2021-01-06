import * as React from 'react';
import {Group, Rect} from 'react-konva';

const Background: React.FunctionComponent<{boardSize: number;}> = ({boardSize}) => {
    return (
        <Group x={0} y={0}>
            <Rect fill="#0E251B" width={boardSize} height={boardSize} perfectDrawEnabled={false} />
        </Group>
    );
};
export default Background;
