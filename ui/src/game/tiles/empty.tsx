import * as React from 'react';
import {Rect} from 'react-konva';

import {Size} from '../../constants';
import {TileProps} from './tileProps';

const Empty: React.FunctionComponent<TileProps> = ({x, y}) => {
    return (
        <Rect
            fill="transparent"
            width={Size.InnerTile}
            height={Size.InnerTile}
            x={x * Size.Tile}
            y={y * Size.Tile}
            stroke="#C2BCB0"
            strokeWidth={1}
            perfectDrawEnabled={false}
        />
    );
};
export default Empty;
