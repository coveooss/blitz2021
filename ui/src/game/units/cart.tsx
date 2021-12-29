import * as React from 'react';
import {Circle, Group, Path} from 'react-konva';

import {Size} from '../../constants';
import {UnitProps} from './unitProps';
import Blitzium from '../tiles/blitzium';
import useCachedRef from '../../hooks/useCachedRef';
import BlitziumCount from './blitziumCount';

const cart = "M7.5 34h25l2.1-2.1V18.5l1.4-1.4v-1.4H4v1.4l1.4 1.4v13.4z";
const cartTopAngle = "M4 17.1h32l-1.4 1.4H5.4z";
const cartBottomAngle = "M5.4 31.9L7.5 34h25l2.1-2.1z";

const Cart: React.FunctionComponent<UnitProps> = ({position, color, darkColor, blitzium}) => {
    const ref = useCachedRef(Size.Tile);

    const {x, y} = position;
    const tileSizeInMockup = 40;
    const pathScale = Size.Tile / tileSizeInMockup;

    return (
        <>
            {blitzium !== 0 && <Blitzium x={x + 0.2} y={y + 0.1} scale={0.6}/>}
            <Group x={x * Size.Tile} y={y * Size.Tile} ref={ref}>
                <Path
                    fill={color}
                    data={cart}
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
                <Path
                    fill={darkColor}
                    data={cartTopAngle}
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
                <Path
                    fill={darkColor}
                    data={cartBottomAngle}
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
                <Circle
                    x={12.4 * pathScale}
                    y={34 * pathScale}
                    radius={3.9 * pathScale}
                    fill="#7b7b7b"
                    stroke="#0e251b"
                    strokeWidth={1.3 * pathScale}
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
                <Circle
                    x={27.6 * pathScale}
                    y={34 * pathScale}
                    radius={3.9 * pathScale}
                    fill="#7b7b7b"
                    stroke="#0e251b"
                    strokeWidth={1.3 * pathScale}
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
            </Group>
            <BlitziumCount color={color} position={{x, y}} blitzium={blitzium} />
        </>
    );
};
export default Cart;
