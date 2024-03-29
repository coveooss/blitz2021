import * as React from 'react'

import { Tick } from 'blitz2021/dist/game/types';
import useWindowSize from '../hooks/useWindowSize';
import {KeyContext, SCORES_SIZE, Size, UI_MIN_SIZE, VisualizationContext} from '../constants';
import { Stage } from 'react-konva';
import Game from '../game/game';
import Infos from '../infos/infos';
import StaticElements from '../game/staticElements';
import TilesTextureCache from '../game/tiles/TileTextureCache';
import KeyHandler from '../replay/controls/keyHandler';
import Shortcuts from '../Shortcuts';

const mainStyle: React.CSSProperties = {
    'backgroundColor': 'rgb(239, 228, 208',
    'color': 'rgb(14, 37, 27)'
}

const titleStyle: React.CSSProperties = {
    'fontSize': '55px',
    'textAlign': 'center',
    'margin': '0px'
}

const Viewer: React.FC = () => {
    const [key, setKey] = React.useState<string | null>(null);
    const [currentTick, setCurrentTick] = React.useState<Tick | null>(null);
    const { width, height } = useWindowSize();
    const [isConnected, setIsConnected] = React.useState(false);

    function start() {
        try {
            console.log('Connecting to WebSocket ...');
            const ws = new WebSocket('ws://' + window.location.hostname + ':8765');

            ws.onopen = () => {
                console.log('Connected!');

                setIsConnected(true);

                ws.send(JSON.stringify({ type: 'VIEWER' }));
            };
            ws.onmessage = (event) => {
                setCurrentTick(JSON.parse(event.data));
            };

            ws.onclose = () => {
                console.log('Socket closing');
                setTimeout(() => start(), 500);

                setIsConnected(false);
                setCurrentTick(null);
            }
        } catch (ex) {
            console.log('Impossible to connect');
            setTimeout(() => start(), 500);

            setIsConnected(false);
            setCurrentTick(null);
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setKey(e.key);
    };


    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setKey(null);
    }

    React.useEffect(start, []);

    const numberOfTile: number = currentTick?.map?.tiles?.[0]?.length ?? 0;
    const boardSize = Math.max(UI_MIN_SIZE, Math.min(height, width - SCORES_SIZE));

    Size.Tile = boardSize / numberOfTile;

    return (
        <KeyHandler onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
            <section style={mainStyle}>
                {!isConnected && <section>
                <h1 style={titleStyle}>Blitz 2021 - Web Viewer</h1>
                    <span>Connecting to the local server ...</span>
                </section>}

                {currentTick !== null && (
                    <section>
                        <Stage width={width} height={height}>
                            <StaticElements firstTick={currentTick} boardSize={boardSize} />
                            <KeyContext.Provider value={{ pressedKey: key }}>
                                <VisualizationContext.Provider value={{ tick: currentTick.tick, boardSize, currentTick }}>
                                    <Game />
                                    <Infos />
                                </VisualizationContext.Provider>
                            </KeyContext.Provider>
                        </Stage>
                        <TilesTextureCache />
                        <Shortcuts />
                    </section>
                )
                }

                {
                    (isConnected && currentTick === null) && <section>
                       <h1 style={titleStyle}>Blitz 2021 - Web Viewer</h1>
                        <p>Connected! 🚀</p>
                        <span>Waiting for the game to start, launch your bot locally and it should connect automatically and start the game!</span>
                    </section>
                }
            </section >
        </KeyHandler>
    );
};

export default Viewer;
