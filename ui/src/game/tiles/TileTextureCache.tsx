import * as React from "react";
import Walls from "./Walls.png";

export enum TexturedTiles {
    Walls = "walls",
}

export const TilesTextureIds: Record<TexturedTiles, string> = {
    [TexturedTiles.Walls]: "walls-image"
}

const TilesTextureImageSrc: Record<TexturedTiles, string> = {
    [TexturedTiles.Walls]: Walls,
}

const TilesTextureCache: React.FC = () => {
    const images: React.ReactNode[] = Object
        .values(TexturedTiles)
        .map(tile => (
            <img src={TilesTextureImageSrc[tile]} id={TilesTextureIds[tile]} />
        ));

    return <div style={{display: "none"}}>{images}</div>
}
export default TilesTextureCache;
