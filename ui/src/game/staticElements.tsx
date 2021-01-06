import * as React from 'react';
import {Layer} from 'react-konva';
import Tiles from './tiles/tiles';
import Bases from './bases';
import {Tick} from 'blitz2021/dist/game/types';
import Background from './background';

const StaticElements: React.FunctionComponent<{firstTick?: Tick, boardSize: number;}> = ({firstTick, boardSize}) => {
    return (
        <Layer listening={false} pixelRatio={1}>
            <Background boardSize={boardSize} />
            <Tiles tiles={firstTick?.map.tiles} />
            <Bases colonies={firstTick?.colonies} />
        </Layer>
    );
}
export default StaticElements;