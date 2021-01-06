import * as React from 'react';

const useCachedRef = () => {
    const ref = React.useRef<any>();

    React.useEffect(() => {
        ref?.current?.cache();
        return () => ref?.current?.clearCache();
    }, [ref?.current]);

    return ref;
}
export default useCachedRef;