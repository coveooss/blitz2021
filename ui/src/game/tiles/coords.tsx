import * as React from 'react';
import {Group, Text} from 'react-konva';

import {Size, VisualizationContext} from '../../constants';
import {TileType} from 'blitz2021/dist/game/types';

const Coords: React.FunctionComponent<{tiles?: TileType[][]}> = ({tiles}) => {
    const {currentTick} = React.useContext(VisualizationContext);

    const coords = currentTick?.map?.tiles?.map((row, x) =>
        row.map((tile: TileType, y) => {
            return (
                <Group key={y + "," + x} x={x * Size.Tile} y={y * Size.Tile}>
                    <Text
                        y={0.5 * Size.Tile}
                        width={Size.InnerTile}
                        height={Size.InnerTile}
                        text={`${y},${x}`}
                        fill="#fff"
                        align="center"
                        fontSize={Size.InnerTile < 14 ? 5 : 10}
                    />
                </Group>
            )
        })
    );

    return (
        <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}}>
            {coords}
        </Group>
    );
};
export default Coords;
