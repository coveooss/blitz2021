import * as React from 'react';
import {debounce} from '../utils/debounce';

const useWindowSize = () => {
    const [windowSize, setWindowSize] = React.useState<{width: number; height: number}>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    React.useEffect(() => {
        const handleResize = debounce(() => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }, 250);

        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}
export default useWindowSize;
