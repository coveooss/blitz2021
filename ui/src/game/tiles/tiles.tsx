import * as React from 'react';
import {Group} from 'react-konva';
import {Size, VisualizationContext} from '../../constants';
import {TileType, Position} from 'blitz2021/dist/game/types';
import {TilesUtils} from '../../utils/tilesUtils';
import Wall from './wall';
import Blitzium from './blitzium';
import Empty from './empty';

const Tiles: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const tiles = currentTick?.map?.tiles?.map((row, y) =>
        row.map((tile: TileType, x) => {
            const defaultProps: Position & {key: string} = {key: `tile-${y}-${x}`, x, y};
            if (TilesUtils.isWall(tile)) {
                return <Wall {...defaultProps} />;
            } else if (TilesUtils.isBlitzium(tile)) {
                return <Blitzium {...defaultProps} />;
            } else {
                return <Empty {...defaultProps} />;
            }
        })
    );

    return (
        <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}}>
            {tiles}
        </Group>
    );
};
export default Tiles;
