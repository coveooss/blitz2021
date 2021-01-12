import * as React from "react";

export type useImageStatus: 'loading' | 'failed' | 'loaded';

interface useImageState {
    image?: HTMLImageElement;
    status: useImageStatus;
}

const defaultState: useImageState = {image: undefined, status: 'loading'};

const useImage = (url: string, crossOrigin?: string): [HTMLImageElement | undefined, useImageStatus] => {
    const [{image, status}, setState] = React.useState<useImageState>(defaultState);

    React.useEffect(() => {
        if (!url) {
            return;
        }

        const img = document.createElement('img');

        const onload = () => {
            setState({image: img, status: 'loaded'});
        }

        const onerror = () => {
            setState({image: undefined, status: 'failed'});
        }

        img.addEventListener('load', onload);
        img.addEventListener('error', onerror);
        if (crossOrigin !== undefined) {
            img.crossOrigin = crossOrigin
        }
        img.src = url;

        return () => {
            img.removeEventListener('load', onload);
            img.removeEventListener('error', onerror);
        };
    }, [url, crossOrigin]);

    return [image, status];
};
export default useImage;