import * as React from 'react';
import {Group, Path} from 'react-konva';

import {Size} from '../../constants';
import {TileProps} from './tileProps';
import useCachedRef from '../../hooks/useCachedRef';

const shapes: Array<{path: string; fill: string;}> = [
    {path: "M11.2 0L22 4.8 23.2 8l-3.6 6 1.2 2.8.8 2.8-13.2 3.2L4 20.4 2.8 18l.4-4L6.4 2z", fill: "#fbe58d"},
    {path: "M0 12l3.2 2L6.4 2z", fill: "#fcd847"},
    {path: "M.8 20l2-2 .4-4L0 12z", fill: "#ffd121"},
    {path: "M.8 20l3.6 5.2-.4-4.8L2.8 18z", fill: "#fcd847"},
    {path: "M4.4 25.2L4 20.4l4.4 2.4-1.2 4.8z", fill: "#ffd121"},
    {path: "M22.4 25.2l-.8-5.6-13.2 3.2-1.2 4.8z", fill: "#fcd847"},
    {path: "M21.6 19.6l.8 5.6 2.4-3.2.4-1.6z", fill: "#ffd121"},
    {path: "M23.2 8l1.2 1.2v3.6L19.6 14z", fill: "#fcd847"},
    {path: "M24.4 12.8L19.6 14l1.2 2.8 4.8-.8z", fill: "#f5c91e"},
    {path: "M20.8 16.8l.8 2.8 4-3.6z", fill: "#ffd121"},
    {path: "M21.6 19.6l3.6.8.4-4.4z", fill: "#fcd847"},
];

const Blitzium: React.FunctionComponent<TileProps & {scale?: number}> = ({x, y, scale = 1}) => {
    const tileSizeInMockup = 26;
    const pathScale = Size.Tile / tileSizeInMockup * scale;
    return (
        <Group x={x * Size.Tile} y={y * Size.Tile}>
            {shapes.map(({path, fill}, i: number) => (
                <Path
                    key={`shape-${i}`}
                    data={path}
                    fill={fill}
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                />
            ))}
        </Group>
    );
};
export default Blitzium;
