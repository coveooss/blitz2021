import * as React from 'react';
import {Group} from 'react-konva';
import {TickCrewUnit, TickCrew} from 'blitz2021/dist/game/types';

import {colors, darkenColors, Size, VisualizationContext} from '../../constants';
import Cart from './cart';
import Outlaw from './outlaw';
import Miner from './miner';
import {UnitProps} from './unitProps';

const Units: React.FunctionComponent = () => {
    const {currentTick} = React.useContext(VisualizationContext);

    const units = currentTick?.crews?.map((crew: TickCrew, i) =>
        crew.units.map((unit: TickCrewUnit, j) => {
            const defaultProps: UnitProps & {key: string} = {
                key: `unit-${i}-${j}`,
                color: colors[i],
                darkColor: darkenColors[i],
                ...unit
            };
            if (unit.type === 'CART') {
                return <Cart {...defaultProps} />;
            } else if (unit.type === "OUTLAW") {
                return <Outlaw {...defaultProps} />;
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
