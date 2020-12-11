import * as React from 'react';
import {Rect} from 'react-konva';

import {Size} from '../../constants';
import {TileProps} from './tileProps';

const Wall: React.FunctionComponent<TileProps> = ({x, y}) => {
    return (
        <Rect
            fill="#F2F2F2"
            opacity={0.2}
            width={Size.Tile}
            height={Size.Tile}
            x={x * Size.Tile - Size.Gap / 2}
            y={y * Size.Tile - Size.Gap / 2}
        />
    );
};
export default Wall;