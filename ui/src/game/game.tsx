import * as React from 'react';
import {Layer} from 'react-konva';
import Background from './background';
import Tiles from './tiles';

const Game: React.FunctionComponent = () => {
    return (
        <>
            <Layer listening={false}>
                <Background/>
                <Tiles />
            </Layer>
        </>
    );
}
export default Game;