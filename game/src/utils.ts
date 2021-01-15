import Libhoney from 'libhoney';


export const hny = new Libhoney({
    writeKey: process.env.HONEYCOMB_KEY,
    dataset: "Blitz",
    disabled: process.env.HONEYCOMB_KEY === undefined
});


export const roundRobin = <T>(array: T[], from: number): T[] => {
    let newArray: T[] = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[(i + from) % array.length]);
    }

    return newArray;
}

export function shuffle<T>(original:T[]) {
    let a = [...original];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const timeoutAfter = async (timeout: number) =>
    new Promise<void>((resolve, reject) => setTimeout(() =>
        resolve(),
        timeout
    ));



