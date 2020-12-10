import * as React from 'react';
import {Group, Text} from 'react-konva';

import {font, fontSize, fontWeight, Size, VisualizationContext} from '../constants';

export interface GameStateProps {
    speed?: number;
}

const GameState: React.FunctionComponent<GameStateProps> = ({speed}) => {
    const verticalMargin = 35;
    const {boardSize, currentTick, tick} = React.useContext(VisualizationContext);
    const y = ((currentTick?.colonies?.length ?? 0) + 2) * verticalMargin;

    return (
        <Group x={boardSize + Size.Gap} y={y}>
            <Text
                fontSize={fontSize}
                fontFamily={font}
                fontStyle={fontWeight}
                fill="red"
                shadowColor="red"
                text={`Step: ${Math.max(0, tick + 1)}`}
                align="left"
            />
            {speed !== undefined
             ? (
                <Text
                    y={verticalMargin}
                    fontSize={fontSize}
                    fontFamily={font}
                    fontStyle={fontWeight}
                    fill="red"
                    shadowColor="red"
                    text={`Speed: ${speed + 1}`}
                    align="right"
                />
            )
            : null
            }
        </Group>
    );
};
export default GameState;
