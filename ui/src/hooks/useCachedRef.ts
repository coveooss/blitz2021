import * as React from 'react';
import useWindowSize from './useWindowSize';

const useCachedRef = () => {
    const ref = React.useRef<any>();
    const {width, height} = useWindowSize();

    React.useEffect(() => {
        ref?.current?.cache();
        return () => ref?.current?.clearCache();
    }, [ref?.current, width, height]);

    return ref;
}
export default useCachedRef;