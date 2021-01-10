import * as React from 'react';
import {Rect} from 'react-konva';

import {Size} from '../constants';

const BaseSafeZone: React.FunctionComponent<{ color: string; safeZoneRadius: number }> = ({color, safeZoneRadius = 3}) => {
    const tiles: React.ReactNode[] = [];
    for (let y = -safeZoneRadius; y <= safeZoneRadius; y++) {
        for (let x = -safeZoneRadius; x <= safeZoneRadius; x++) {
            tiles.push(
                <Rect
                    key={`${x}-${y}`}
                    x={x * Size.Tile}
                    y={y * Size.Tile}
                    opacity={0.3}
                    fill={color}
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    perfectDrawEnabled={false}
                />
            );
        }
    }

    return (
        <>{tiles}</>
    );
};
export default BaseSafeZone;
