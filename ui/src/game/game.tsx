import * as React from 'react';
import {Layer} from 'react-konva';
import Background from './background';
import Depots from './depots/depots'
import Tiles from './tiles/tiles';
import Units from './units/units';
import Paths from './units/paths/paths';
import Bases from './bases';
import SpawnPoints from './spawnPoints';
import {keyCodes, KeyContext} from '../constants';

const Game: React.FunctionComponent = () => {
    const {pressedKey} = React.useContext(KeyContext);
    return (
        <>
            <Layer listening={false}>
                <Background/>
                <Tiles />
                <SpawnPoints />
                <Bases />
            </Layer>
            {/* different layer to avoid repainting the first one if it doesn't change */}
            <Layer listening={false}>
                {pressedKey === keyCodes.P && <Paths />}
                <Depots />
                <Units />
            </Layer>
        </>
    );
}
export default Game;