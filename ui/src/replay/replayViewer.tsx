import * as React from 'react';
import {keyCodes, Size, speeds, VisualizationContext} from '../constants';
import KeyHandler from './controls/keyHandler';
import {Tick} from 'blitz2021/dist/game/types';
import {Stage} from 'react-konva';
import Infos from '../infos/infos';
import Game from '../game/game';

export interface IReplayViewerProps {
    ticks: Tick[];
    width: number;
    height: number;
    onEnd?: () => void;
}

const ReplayViewer: React.FunctionComponent<IReplayViewerProps> = ({width, height, ticks, onEnd}) => {
    const [tick, setTick] = React.useState(0);
    const [speed, setSpeed] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);

    const currentTick = ticks[tick];
    const numberOfTile: number = ticks?.[0]?.map?.tiles?.[0]?.length ?? 0;
    const boardSize = Math.min(height, Math.min(width - 250));

    Size.Tile = boardSize / numberOfTile;

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const gameStart = 0;
        const gameMax = ticks.length - 1;
        switch (e.key) {
            case keyCodes.Space:
                setIsPaused(!isPaused);
                break;
            case keyCodes.Z:
                setTick(gameStart);
                break;
            case keyCodes.X:
                setTick(gameMax);
                break;
            case keyCodes.Comma:
                setTick(Math.max(tick - 1, gameStart));
                break;
            case keyCodes.Period:
                setTick(Math.min(tick + 1, gameMax));
                break;
            case keyCodes.One:
                setSpeed(0);
                break;
            case keyCodes.Two:
                setSpeed(1);
                break;
            case keyCodes.Three:
                setSpeed(2);
                break;
            case keyCodes.Four:
                setSpeed(3);
                break;
            case keyCodes.Five:
                setSpeed(4);
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        if (!isPaused) {
            const lastTick = ticks.length - 1;
            const newTick = Math.min(tick + 1, lastTick);
            let timeout: number;
            if (newTick === lastTick && onEnd) {
                // After 5 seconds, call the onEnd Props
                timeout = window.setTimeout(onEnd, 5000);
            } else {
                // play next game tick
                timeout = window.setTimeout(() => setTick(newTick), speeds[speed]);
            }
            return () => window.clearTimeout(timeout);
        }
        return undefined;
    }, [tick, isPaused, speed]);

    return (
        <KeyHandler onKeyDown={onKeyDown}>
            <Stage width={width} height={height} >
                <VisualizationContext.Provider value={{tick, boardSize, currentTick}}>
                    <Game />
                    <Infos speed={speed} />
                </VisualizationContext.Provider>
            </Stage>
        </KeyHandler>
    );
};
export default ReplayViewer;