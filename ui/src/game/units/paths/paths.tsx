import * as React from 'react';
import {Group, Rect} from 'react-konva';

import {CAPTURED_GAP_RATIO, colors, Size, VisualizationContext} from '../../../constants';
import {TickColony, TickColonyUnit} from 'blitz2021/dist/game/types';
import PathCorner from './pathCorner';

const Paths: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const units = currentTick?.colonies?.map((colony: TickColony, i) =>
        colony.units.map((unit: TickColonyUnit, j) =>
        <React.Fragment key={`player-tail-${unit.id}`}>
            {unit.path
                .map(({x, y}, index: number) => {
                    const posY = y * Size.Tile;
                    const posX = x * Size.Tile;

                    if (index < unit.path.length - 1) {
                        const previous = unit.path[index - 1] ?? unit.position;
                        const next = unit.path[index + 1];
                        const lineSize = 0.1 * Size.Tile;
                        const halfOffset = Size.InnerTile / 2 - lineSize / 2;
                        const isVertical = next && next.y !== y && next.x === x;
                        const isACorner = previous && next && previous.x !== next.x && previous.y !== next.y;

                        return isACorner ? (
                            <PathCorner
                                key={`player-tail-${unit.id}-${index}`}
                                x={x}
                                y={y}
                                previous={previous}
                                next={next}
                                color={colors[i]}
                                lineSize={lineSize}
                            />
                        ) : (
                                   <Rect
                                       key={`player-tail-${unit.id}-${index}`}
                                       fill={colors[i]}
                                       width={isVertical ? lineSize : Size.Tile}
                                       height={isVertical ? Size.Tile : lineSize}
                                       x={isVertical ? posX + halfOffset : posX - Size.Gap / 2}
                                       y={isVertical ? posY - Size.Gap / 2 : posY + halfOffset}
                                       perfectDrawEnabled={false}
                                   />
                               );
                    }
                    return null;
                })
                .filter(Boolean)
                .sort((a: React.ReactElement, b: React.ReactElement) => {
                    if (a.props.x !== b.props.x) {
                        return b.props.x - a.props.x;
                    }
                    return a.props.y - b.props.y;
                })}
        </React.Fragment>
    ));
    return <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}}>{units}</Group>;
};
export default Paths;
