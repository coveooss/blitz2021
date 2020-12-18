import * as React from 'react';
import {Group, Path, Rect} from 'react-konva';

import {Size, VisualizationContext, colors} from '../constants';
import {TickColony} from 'blitz2021/dist/game/types';

const roof = "M35.3 4l1.1 8.5c.1.6-.4 1.2-1 1.3H2.3c-.6 0-1.1-.5-1.1-1.1v-.1L2.3 4c.1-.6.6-1 1.1-1h30.7c.6 0 1.1.4 1.2 1z";
const house = "M3.3 13.7h31v19.2h-31z";
const floor = "M2.1 32.9h33.3v2.3H2.1z";
const door = "M13.4 20.9h10.7v12H13.4z";
const sign = "M8.1 18.8c0-1.4-.7-2-2.1-2v-6.1c1.4 0 2.1-.7 2.1-2h20.7c0 1.4.7 2 2.1 2v6.1c-1.4 0-2.1.7-2.1 2H8.1z";

const Bases: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const tileSizeInMockup = 38;
    const pathScale = Size.Tile / tileSizeInMockup;

    const bases = currentTick?.colonies?.map((colony: TickColony, i) => {
        const {x, y} = colony.homeBase;
        return (
            <Group key={`base-${i}`} x={x * Size.Tile} y={y * Size.Tile}>
                <Rect
                    fill="#efe4d0"
                    width={Size.Tile}
                    height={Size.Tile}
                />
                <Path
                    data={roof}
                    fill="#0e251b"
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                />
                <Path
                    data={house}
                    fill="#7b7b7b"
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                />
                <Path
                    data={floor}
                    fill="#0e251b"
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                />
                <Path
                    data={door}
                    fill="#0e251b"
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                />
                <Path
                    data={sign}
                    fill={colors[i]}
                    width={Size.InnerTile}
                    height={Size.InnerTile}
                    scale={{x: pathScale, y: pathScale}}
                />
            </Group>
        );
    });

    return (
        <>{bases}</>
    );
};
export default Bases;
