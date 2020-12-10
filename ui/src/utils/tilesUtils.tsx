const isWall = (tile: string): boolean => tile === 'WALL';

const isBlitzium = (tile: string): boolean => tile === 'DEPOT';

const isBase = (tile: string): boolean => tile === 'BASE';

export const TilesUtils = {
    isBase,
    isBlitzium,
    isWall,
};
