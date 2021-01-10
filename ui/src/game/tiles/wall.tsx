import * as React from 'react';
import {Group, Path, Rect} from 'react-konva';

import {Size} from '../../constants';
import {TileProps} from './tileProps';
import useCachedRef from '../../hooks/useCachedRef';

const paths = [
    "M5 0l3 6c0 1-1 2-3 1S3 5 0 5V0h5zM0 6c2 0 3 3 6 3s4 1 4 2-5 5-10 5V6zM0 17c4 0 8 1 8 4s-4 4-8 4v-8zM0 26c5 0 13 3 13 5 0 3-8 4-8 9H0V26zM6 40l5-4c2-1 2-4 4-4s2 4 2 8H6zM18 40c0-3 1-6 3-6 3 0 8 3 8 6H18z",
    "M30 40c0-5-4-5-4-7s4-7 14-7v14H30zM40 25c-2 0-5-5-5-6s1-2 5-2v8zM40 16c-6 0-12-2-12-3 0-2 4-8 6-8l6 1v10zM40 5l-6-1-4 1-1-1 1-1V0h10v5zM29 0c0 1-2 2-2 6 0 3-1 5-3 7s-4 5-6 5c-1 0-5-2-5-5s5-9 5-13h11zM6 0c0 2 3 3 3 5 0 3 1 4 3 4s1-3 3-5l2-4H6zM7 16l2-1c1-1 2-2 3 1 2 4 4 1 4 6s0 7-2 7-5-2-5-6 1-4-1-5c-1-1-2-1-1-2z",
    "M18 32c3 2 6 0 8-3l9-4c1 0 2-4-3-7-4-3-6-3-9-1-4 3-6 4-6 8s-2 5 1 7z",
];

const Wall: React.FunctionComponent<TileProps> = ({x, y}) => {
    const ref = useCachedRef();
    const tileSizeInMockup = 40;
    const pathScale = Size.Tile / tileSizeInMockup;
    return (
        <Group x={x * Size.Tile} y={y * Size.Tile} ref={ref}>
            <Rect fill="#0E251B" width={Size.InnerTile} height={Size.InnerTile} perfectDrawEnabled={false} />
            {paths.map((p) => (
                <Path
                    key={p}
                    data={p}
                    fill="#7B7B7B"
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                />
            ))}
        </Group>
    );
};
export default Wall;