import * as React from 'react';
import {Group, Rect, Text} from 'react-konva';

import {keyCodes, KeyContext, Size} from '../../constants';
import {UnitProps} from './unitProps';

const BlitziumCount: React.FunctionComponent<Pick<UnitProps, 'position' | 'color' | 'blitzium'>> = ({position, color, blitzium}) => {
    const {pressedKey} = React.useContext(KeyContext);

    const {x, y} = position;

    return pressedKey === keyCodes.C ? (
        <Group x={x * Size.Tile} y={y * Size.Tile}>
            <Rect opacity={0.7} fill="#0E251B" width={Size.InnerTile} height={Size.InnerTile} perfectDrawEnabled={false}/>
            <Text
                y={0.25 * Size.Tile}
                width={Size.InnerTile}
                height={Size.InnerTile}
                text={blitzium.toString()}
                fill={color}
                align="center"
                fontSize={Size.InnerTile < 14 ? 8 : 12}
            />
        </Group>
    ) : null

};
export default BlitziumCount;
