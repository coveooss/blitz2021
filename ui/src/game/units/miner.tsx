import * as React from 'react';
import {Group, Path} from 'react-konva';

import {Size} from '../../constants';
import {UnitProps} from './unitProps';
import Blitzium from '../tiles/blitzium';
import useCachedRef from '../../hooks/useCachedRef';
import BlitziumCount from './blitziumCount';

const handle = "M24.9 4.3l3.5 2c.3.2.4.5.2.8L12.1 35.7c-.2.3-.5.4-.8.2l-3.5-2c-.3-.2-.4-.5-.2-.8L24.1 4.5c.2-.3.5-.4.8-.2z";
const pick = "M21.9 7.4l.4-.7c.2-.3.5-.4.8-.2l4.2 2.4c.3.2.4.5.2.8l-.3.5c1.8 1.2 3.7 2.6 5.6 4.2l-2.3 2.9c-1.6-1.6-3.3-3-5-4.2l-.5.7c-.2.3-.5.4-.8.2L20 11.6c-.3-.2-.4-.5-.2-.8l.5-.8c-4.5-2.2-9-3.1-13.3-2.7 4.1-2.3 9.3-2.3 14.9.1z";

const Miner: React.FunctionComponent<UnitProps> = ({position, color, darkColor, blitzium}) => {
    const ref = useCachedRef(Size.Tile);

    const {x, y} = position;

    const tileSizeInMockup = 40;
    const pathScale = Size.Tile / tileSizeInMockup;

    return (
        <>
            {blitzium !== 0 && <Blitzium x={x + 0.55} y={y + 0.55} scale={0.4}/>}
            <Group x={x * Size.Tile} y={y * Size.Tile} ref={ref}>
                <Path
                    data={handle}
                    scale={{x: pathScale, y: pathScale}}
                    fill={darkColor}
                />
                <Path
                    data={pick}
                    scale={{x: pathScale, y: pathScale}}
                    fill={color}
                />
            </Group>
            <BlitziumCount color={color} position={{x, y}} blitzium={blitzium} />
        </>
    );
};
export default Miner;
