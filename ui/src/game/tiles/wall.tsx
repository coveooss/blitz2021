import * as React from 'react';
import {Group, Rect, Image} from 'react-konva';

import {Size} from '../../constants';
import {TileProps} from './tileProps';
import useCachedTexture from '../../hooks/useCachedTexture';
import {TexturedTiles} from './TileTextureCache';

const WallImage: React.FC = () => {
    const [image] = useCachedTexture(TexturedTiles.Walls);

    if (image === null) {
        return <Rect fill="#7B7B7B" width={Size.InnerTile} height={Size.InnerTile} perfectDrawEnabled={false} />;
    }

    return (
        <>
            <Rect fill="#0E251B" width={Size.InnerTile} height={Size.InnerTile} perfectDrawEnabled={false} />
            <Image image={image} width={Size.InnerTile} height={Size.InnerTile} />
        </>
    );

};


const Wall: React.FunctionComponent<TileProps> = ({x, y}) => {
    return (
        <Group x={x * Size.Tile} y={y * Size.Tile}>
            <WallImage />
        </Group>
    );
};
export default Wall;