import * as React from 'react';
import {Group, Rect} from 'react-konva';
import useCachedRef from '../hooks/useCachedRef';
import {Size} from '../constants';

const Grid: React.FunctionComponent<{boardSize: number; size: {x: number; y: number;}}> = ({boardSize, size}) => {
    const ref = useCachedRef(boardSize);
    const lines: React.ReactNode[] = [];
    for (let y = 1; y < size.y; y++) {
        lines.push(
            <Rect
                key={`horizontal-${y}`}
                x={0}
                y={y * Size.Tile}
                fill="#C2BCB0"
                width={boardSize}
                height={1}
            />
        )
    }
    for (let x= 1; x < size.x; x++) {
        lines.push(
            <Rect
                key={`vertical-${x}`}
                x={x * Size.Tile}
                y={0}
                fill="#C2BCB0"
                width={1}
                height={boardSize}
            />
        )
    }
    return (
        <Group x={0} y={0} ref={ref}>
            {lines}
        </Group>
    );
};
export default Grid;
