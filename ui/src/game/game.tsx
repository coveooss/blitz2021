import * as React from 'react';
import {Layer} from 'react-konva';
import Background from './background';
import Tiles from './tiles/tiles';
import Units from './units/units';


const Game: React.FunctionComponent = () => {
    return (
        <>
            <Layer listening={false}>
                <Background/>
                <Tiles />
            </Layer>
            {/* different layer to avoid repainting the first one if it doesn't change */}
            <Layer listening={false}>
                <Units />
            </Layer>
        </>
    );
}
export default Game;