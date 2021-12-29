import * as React from 'react';
import {Group} from 'react-konva';
import {Size} from '../../constants';
import {TileType, Position} from 'blitz2021/dist/game/types';
import {TilesUtils} from '../../utils/tilesUtils';
import Wall from './wall';
import Blitzium from './blitzium';
import useCachedRef from '../../hooks/useCachedRef';

const Tiles: React.FunctionComponent<{tiles?: TileType[][]; boardSize: number}> = ({tiles, boardSize}) => {
    const ref = useCachedRef(boardSize);

    const tilesShape = tiles?.map((row, x) =>
        row.map((tile: TileType, y) => {
            const defaultProps: Position & {key: string} = {key: `tile-${x}-${y}`, x, y};
            if (TilesUtils.isWall(tile)) {
                return <Wall {...defaultProps} />;
            } else if (TilesUtils.isBlitzium(tile)) {
                return <Blitzium {...defaultProps} />;
            }
        })
    );

    return (
        <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}} ref={ref}>
            {tilesShape}
        </Group>
    );
};
export default Tiles;
