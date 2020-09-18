
export type Position = { x: number, y: number }

export const isAdjacent = (a: Position, b: Position) => {
    return (a.x === b.x && (a.y === b.y - 1 || a.y === b.y + 1)) ||
        (a.y === b.y && (a.x === b.x - 1 || a.x === b.x + 1));
}

export const distanceBetween = (from: Position, to: Position) => {
    return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
}

export const hash = (position: Position) => `${position.x}|${position.y}`;