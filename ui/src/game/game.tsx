import * as React from 'react';
import {Layer} from 'react-konva';
import Depots from './depots/depots'
import Units from './units/units';
import Paths from './units/paths/paths';
import {keyCodes, KeyContext} from '../constants';
import Coords from './tiles/coords';

const Game: React.FunctionComponent = () => {
    const {pressedKey} = React.useContext(KeyContext);
    return (
        <Layer listening={false} pixelRatio={1}>
            {pressedKey === keyCodes.G && <Coords />}
            {pressedKey === keyCodes.P && <Paths />}
            <Depots />
            <Units />
        </Layer>
    );
}
export default Game;