import * as React from 'react';
import {Group, Rect} from 'react-konva';
import useCachedRef from '../hooks/useCachedRef';

const Background: React.FunctionComponent<{boardSize: number;}> = ({boardSize}) => {
    const ref = useCachedRef();
    return (
        <Group x={0} y={0} ref={ref}>
            <Rect fill="#0E251B" width={boardSize} height={boardSize} perfectDrawEnabled={false} />
        </Group>
    );
};
export default Background;
