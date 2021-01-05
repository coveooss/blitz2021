import Libhoney from 'libhoney';


export const hny = new Libhoney({
    writeKey: process.env.HONEYCOMB_KEY,
    dataset: "Blitz",
    disabled: process.env.HONEYCOMB_KEY === undefined
});


export const timeoutAfter = async (timeout: number) =>
    new Promise<void>((resolve, reject) => setTimeout(() =>
        resolve(),
        timeout
    ));



