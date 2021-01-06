import * as React from 'react';
import {Group, Text} from 'react-konva';
import {colors, font, fontSize, fontWeight, Size, VisualizationContext} from '../constants';

const Scores: React.FunctionComponent = () => {
    const verticalMargin = 35;
    const {boardSize, currentTick} = React.useContext(VisualizationContext);
    const teamNameMaxLength = 200;
    const getTeamOffset = (i: number) => i * verticalMargin;
    const scores = currentTick?.colonies?.map(({id, name, blitzium}, i: number) => {
        const y = getTeamOffset(i) + verticalMargin;
        const color = colors[i];
        return (
            <React.Fragment key={`player-score-${id}`}>
                <Text
                    y={y}
                    width={teamNameMaxLength}
                    fontSize={fontSize}
                    fontFamily={font}
                    fontStyle={fontWeight}
                    fill={color}
                    shadowColor={color}
                    text={name}
                    align="left"
                    wrap="none"
                    ellipsis
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
                <Text
                    x={teamNameMaxLength}
                    y={y}
                    fontSize={fontSize}
                    fontFamily={font}
                    fontStyle={fontWeight}
                    fill={color}
                    shadowColor={color}
                    text={blitzium.toString()}
                    align="left"
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
            </React.Fragment>
        );
    }) ?? [];

    return (
        <Group x={boardSize + Size.Gap}>
            <Text
                fontSize={fontSize}
                fontFamily={font}
                fontStyle={fontWeight}
                fill="#6EE4CE"
                shadowColor="#6EE4CE"
                text="Team"
                align="left"
            />
            {scores}
        </Group>
    );
};
export default Scores;
