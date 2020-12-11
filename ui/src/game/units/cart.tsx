import * as React from 'react';
import {Rect} from 'react-konva';

import {GAP_RATIO, Size} from '../../constants';
import {TickColonyUnit} from 'blitz2021/dist/game/types';

const Cart: React.FunctionComponent<TickColonyUnit> = ({position}) => {
    const {x, y} = position;
    return (
        <Rect
            fill="red"
            opacity={0.2}
            width={Size.InnerTile}
            height={Size.InnerTile}
            x={x * Size.Tile}
            y={y * Size.Tile}
            shadowColor="rgb(45,41,38)"
            shadowOffset={{x: (-GAP_RATIO / 2) * Size.InnerTile, y: (GAP_RATIO / 2) * Size.InnerTile}}
            shadowOpacity={0.3}
        />
    );
};
export default Cart;
