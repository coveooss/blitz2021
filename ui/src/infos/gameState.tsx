import * as React from 'react';
import {Group, Text} from 'react-konva';

import {font, fontSize, fontWeight, Size, VisualizationContext, metaTextColor} from '../constants';

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
                fill={metaTextColor}
                shadowColor={metaTextColor}
                text={`Tick: ${Math.max(0, currentTick.tick + 1)}`}
                align="left"
                hitStrokeWidth={0}
                shadowForStrokeEnabled={false}
            />
            {speed !== undefined
             ? (
                <Text
                    y={verticalMargin}
                    fontSize={fontSize}
                    fontFamily={font}
                    fontStyle={fontWeight}
                    fill={metaTextColor}
                    shadowColor={metaTextColor}
                    text={`Speed: ${speed + 1}`}
                    align="right"
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
            )
            : null
            }
        </Group>
    );
};
export default GameState;
