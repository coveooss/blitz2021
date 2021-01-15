import * as React from 'react';
import {Tick} from 'blitz2021/dist/game/types';
import useWindowSize from '../hooks/useWindowSize';
import ReplayViewer from '../replay/replayViewer';
import ErrorBoundary from '../utils/ErrorBoundary';
import Shortcuts from '../Shortcuts';

const Replay: React.FC = () => {
    const [data, setData] = React.useState<Tick[] | null>(null);
    const {width, height} = useWindowSize();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files?.length === 1) {
            const reader = new FileReader();
            reader.readAsText(files[0], 'UTF-8');
            reader.onload = (evt) => {
                try {
                    const game = JSON.parse(evt?.target?.result as string);
                    setData(game);
                } catch (e) {
                    alert('game file parsing failed');
                }
            };
        }
    };

    if (data) {
        return (
            <ErrorBoundary>
                <ReplayViewer width={width} height={height} ticks={data} />
                <Shortcuts />
            </ErrorBoundary>
        );
    }

    return <input type="file" onChange={onChange} />;
};
export default Replay;
