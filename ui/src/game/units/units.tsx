import * as React from 'react';
import {Group} from 'react-konva';

import {Size, VisualizationContext} from '../../constants';
import {TickColonyUnit, TickColony} from 'blitz2021/dist/game/types';
import Cart from './cart';
import Cowboy from './cowboy';
import Miner from './miner';

const Units: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const units = currentTick?.colonies?.map((colony: TickColony, i) =>
        colony.units.map((unit: TickColonyUnit, j) => {
            const defaultProps: TickColonyUnit & {key: string} = {key: `unit-${i}-${j}`, ...unit};
            if (unit.type === 'CART') {
                return <Cart {...defaultProps} />;
            } else if (unit.type === "COWBOY") {
                return <Cowboy {...defaultProps} />;
            } else if (unit.type === "MINER") {
                return <Miner {...defaultProps} />;
            }
            console.error("Unknown unit type, skipping rendering", unit.type);
            return null;
        })
    );

    return (
        <Group offset={{x: -0.5 * Size.Gap, y: -0.5 * Size.Gap}}>
            {units}
        </Group>
    );
};
export default Units;
