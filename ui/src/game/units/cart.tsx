import * as React from 'react';
import {Rect} from 'react-konva';

import {GAP_RATIO, Size} from '../../constants';
import {UnitProps} from './unitProps';

const Cart: React.FunctionComponent<UnitProps> = ({position, color}) => {
    const {x, y} = position;
    return (
        <Rect
            fill={color}
            width={Size.InnerTile}
            height={Size.InnerTile}
            x={x * Size.Tile}
            y={y * Size.Tile}
            strokeWidth={2}
            stroke="yellow"
            shadowColor="rgb(45,41,38)"
            shadowOffset={{x: (-GAP_RATIO / 2) * Size.InnerTile, y: (GAP_RATIO / 2) * Size.InnerTile}}
            shadowOpacity={0.3}
        />
    );
};
export default Cart;
