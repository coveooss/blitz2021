import * as React from "react";
import {TexturedTiles, TilesTextureIds} from '../game/tiles/TileTextureCache';

const useCachedTexture = (tile: TexturedTiles) => {
    const [image, setImage] = React.useState<HTMLImageElement | null>(null);

    React.useEffect(() => {
        const img = document.getElementById(TilesTextureIds[tile]) as HTMLImageElement;
        setImage(img);
    }, [tile]);

    return [image];
};
export default useCachedTexture;
