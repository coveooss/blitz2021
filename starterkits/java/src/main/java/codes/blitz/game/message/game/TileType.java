/**
 * Copyright (c) 2011 - 2019, Coveo Solutions Inc.
 */
package codes.blitz.game.message.game;

public enum TileType {
    EMPTY, WALL, BASE, MINE;

    //Probably easier to use the java stuff directly
    public static TileType getTileTypeFromString(String rawTile) {
        switch (rawTile) {
            case "EMTPY":
                return TileType.EMPTY;
            case "WALL":
                return TileType.WALL;
            case "MINE":
                return TileType.MINE;
            case "BASE":
                return TileType.BASE;
            default:
                throw new IllegalArgumentException(String.format("'%s' is not a valid tile", rawTile));
        }
    }
}
