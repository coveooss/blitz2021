import * as React from 'react';
import {Tick} from 'blitz2021/dist/game/types';

export const TILE_RATIO = 1;
export const GAP_RATIO = 1 - TILE_RATIO;

export const CAPTURED_TILE_RATIO = 0.8;
export const CAPTURED_GAP_RATIO = 1 - CAPTURED_TILE_RATIO;

export const font = 'Arial';
export const fontSize = 24;
export const smallFontSize = 16;
export const fontWeight = 'bold';

export const darkenColors = ['#547DA3', '#368E65', '#BC9811', '#771616'];
export const colors = ['#79A8D4', '#5BB88C', '#E9AD32', '#B02E2E'];

export const speeds = [1000, 700, 500, 300, 100, 50, 25, 10, 5, 2];

export const AnglePerDirection = {
    LEFT: 180,
    RIGHT: 0,
    UP: -90,
    DOWN: 90,
};

export const keyCodes = {
    C: 'c',
    Comma: ',',
    Eight: '8',
    Five: '5',
    Four: '4',
    Nine: '9',
    One: '1',
    Period: '.',
    Space: ' ',
    Seven: '7',
    Six: '6',
    Three: '3',
    Two: '2',
    P: 'p',
    X: 'x',
    Z: 'z',
    Down: 'ArrowDown',
    Up: 'ArrowUp',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
};

export interface IVisualizationContext {
    tick: number;
    currentTick: Tick;
    boardSize: number;
}

export interface IKeyContext {
    pressedKey: string | null;
}

export const KeyContext = React.createContext<IKeyContext>({} as IKeyContext);

export const VisualizationContext = React.createContext<IVisualizationContext>({} as IVisualizationContext);

export class Size {
    static _tile = 50;
    static get Tile() { return Size._tile; }

    static set Tile(tile: number) { Size._tile = tile;}

    static get Gap() {
        return Size.Tile * GAP_RATIO;
    }

    static get InnerTile() {
        return Size.Tile * TILE_RATIO;
    }
}
