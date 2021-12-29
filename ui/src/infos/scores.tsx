import * as React from 'react';
import {Group, Text} from 'react-konva';
import {
    colors,
    font,
    fontSize,
    fontWeight,
    keyCodes,
    KeyContext,
    metaTextColor,
    SCORES_SIZE,
    Size,
    VisualizationContext
} from '../constants';

const Scores: React.FunctionComponent = () => {
    const verticalMargin = 35;
    const {boardSize, currentTick} = React.useContext(VisualizationContext);
    const {pressedKey} = React.useContext(KeyContext);

    const teamNameMaxLength = 200;
    const getTeamOffset = (i: number) => i * verticalMargin;
    const mappedColors = currentTick?.crews?.reduce((memo: Record<string, string>, crew, j: number) => {
        memo[crew.id] = colors[j] + "";
        return memo;
    }, {});
    // sort modifies the original array so we must do a copy first
    const scores = [...currentTick?.crews ?? []]
                       ?.sort((a, b) => {
                           let diff = b.blitzium - a.blitzium;
                           if (pressedKey === keyCodes.T) {
                               diff = b.totalBlitzium - a.totalBlitzium;
                           }
                           return diff === 0 ? a.name.localeCompare(b.name) : diff;
                       })
                       ?.map(({id, name, blitzium, totalBlitzium}, i: number) => {
        const y = getTeamOffset(i) + verticalMargin;
        const color = mappedColors[id];
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
                    text={pressedKey === keyCodes.T ? totalBlitzium.toString() : blitzium.toString()}
                    align="left"
                    hitStrokeWidth={0}
                    shadowForStrokeEnabled={false}
                />
            </React.Fragment>
        );
    });

    return (
        <Group x={boardSize + Size.Gap}>
            <Text
                fontSize={fontSize}
                fontFamily={font}
                fontStyle={fontWeight}
                fill={metaTextColor}
                shadowColor={metaTextColor}
                text={pressedKey === keyCodes.T ? "Total Blitzium" : "Scores"}
                align="center"
                width={SCORES_SIZE}
                hitStrokeWidth={0}
                shadowForStrokeEnabled={false}
            />
            {scores}
        </Group>
    );
};
export default Scores;
