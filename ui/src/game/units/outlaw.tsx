import * as React from 'react';
import {Group, Path} from 'react-konva';

import {Size} from '../../constants';
import {UnitProps} from './unitProps';
import useCachedRef from '../../hooks/useCachedRef';

const hatLight = "M28.4,16.6c-0.7-0.6-1-1.6-1-2.8c0-0.2,0-0.4,0-0.6H12.6c0,0.2,0,0.4,0,0.6c0.1,1.2-0.3,2.1-1,2.8H28.4z";
const hatDark = "M3,14.9c0-2.6,2.1-0.5,3.8,0.5c1.7,0.9,2.8,1.3,4.8,1.3c0.7-0.6,1.1-1.6,1-2.8 C12.5,12,14,8,17,8c1.6,0,0.4,2.6,2.8,2.8l0.2,0c2.7,0,1.4-2.8,3-2.8c3,0,4.5,4,4.4,5.9c-0.1,1.2,0.3,2.2,1,2.8c2,0,3.1-0.3,4.8-1.3 c1.7-0.9,3.8-3.1,3.8-0.5s-5,7.4-17,7.4l0,0C8,22.3,3,17.5,3,14.9z";
const face = "M20,22.3c-3.1,0-5.7-0.3-7.9-0.8C12,22,12,22.5,12,23c0,5.5,3.6,8,8,8s8-2.5,8-8c0-0.5,0-1-0.1-1.5 C25.7,22,23.1,22.3,20,22.3z";

const Outlaw: React.FunctionComponent<UnitProps> = ({position, color, darkColor}) => {
    const {x, y} = position;
    const tileSizeInMockup = 40;
    const pathScale = Size.Tile / tileSizeInMockup;
    const ref = useCachedRef(Size.Tile);

    return (
        <Group id="position" x={Size.Tile * x - Size.Gap / 2} y={Size.Tile * y - Size.Gap / 2} ref={ref}>
            <Path
                data={hatDark}
                scale={{x: pathScale, y: pathScale}}
                fill={darkColor}
            />
            <Path
                data={hatLight}
                scale={{x: pathScale, y: pathScale}}
                fill={color}
            />
            <Path
                data={face}
                scale={{x: pathScale, y: pathScale}}
                fill={color}
            />
    </Group>
    );
};
export default Outlaw;
