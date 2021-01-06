import * as React from 'react'

import {Tick} from 'blitz2021/dist/game/types';
import useWindowSize from '../hooks/useWindowSize';
import {Size, VisualizationContext} from '../constants';
import {Stage} from 'react-konva';
import Game from '../game/game';
import Infos from '../infos/infos';
import StaticElements from '../game/staticElements';

const Viewer: React.FC = () => {
    const [currentTick, setCurrentTick] = React.useState<Tick | null>(null);
    const {width, height} = useWindowSize();

    function start() {
        const ws = new WebSocket('ws://' + window.location.hostname + ':8765');

        ws.onopen = () => {
            ws.send(JSON.stringify({type: 'VIEWER'}));
        };
        ws.onmessage = (event) => {
            setCurrentTick(JSON.parse(event.data));
        };
    }

    React.useEffect(start, []);

    if (!currentTick) {
        return null;
    }

    const numberOfTile: number = currentTick?.map?.tiles?.[0]?.length ?? 0;
    const boardSize = Math.min(height, Math.min(width - 250));

    Size.Tile = boardSize / numberOfTile;

    return (
        <Stage width={width} height={height}>
            <StaticElements firstTick={currentTick} boardSize={boardSize} />
            <VisualizationContext.Provider value={{tick: currentTick.tick, boardSize, currentTick}}>
                <Game />
                <Infos />
            </VisualizationContext.Provider>
        </Stage>
    );
};

export default Viewer;
