import * as React from 'react';
import {Layer} from 'react-konva';
import Tiles from './tiles/tiles';
import Bases from './bases';
import {Tick} from 'blitz2021/dist/game/types';
import Background from './background';
import Grid from './grid';

const StaticElements: React.FunctionComponent<{firstTick?: Tick, boardSize: number;}> = ({firstTick, boardSize}) => {
    const size = {x: firstTick?.map?.tiles?.[0].length ?? 0, y: firstTick?.map?.tiles.length};
    return (
        <Layer listening={false} pixelRatio={1}>
            <Background boardSize={boardSize} />
            <Grid boardSize={boardSize} size={size} />
            <Bases colonies={firstTick?.colonies} />
            <Tiles tiles={firstTick?.map.tiles} />
        </Layer>
    );
}
export default StaticElements;