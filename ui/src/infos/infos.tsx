import * as React from 'react';
import {Layer, Rect} from 'react-konva';
import GameState from './gameState';
import Scores from './scores';
import {SCORES_SIZE, Size, VisualizationContext} from '../constants';

export interface InfosProps {
    speed?: number;
}

const Infos: React.FunctionComponent<InfosProps> = ({speed}) => {
    const {boardSize} = React.useContext(VisualizationContext);
    return (
        <Layer listening={false} pixelRatio={1}>
            <Rect fill="#efe4d0" x={boardSize} width={SCORES_SIZE} height={boardSize} perfectDrawEnabled={false} />
            <Rect fill="#efe4d0" y={boardSize} width={boardSize + SCORES_SIZE} height={2 * Size.Tile} perfectDrawEnabled={false} />
            <Scores />
            <GameState speed={speed} />
        </Layer>
    );
};
export default Infos;
