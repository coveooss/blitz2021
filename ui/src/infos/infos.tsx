import * as React from 'react';
import {Layer} from 'react-konva';
import GameState from './gameState';
import Scores from './scores';

export interface InfosProps {
    speed?: number;
}

const Infos: React.FunctionComponent<InfosProps> = ({speed}) => {
    return (
        <Layer listening={false}>
            <Scores />
            <GameState speed={speed} />
        </Layer>
    );
};
export default Infos;
