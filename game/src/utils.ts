import Libhoney from 'libhoney';
import { Crew } from './game/crews/crew';
import { CrewStats } from './game/game';


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

export function shuffle<T>(original: T[]) {
    let a = [...original];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function average(array: number[]) {
    return array.reduce((a, b) => a + b, 0) / array.length;
}

export const timeoutAfter = async (timeout: number) =>
    new Promise<void>((resolve, reject) => setTimeout(() =>
        resolve(),
        timeout
    ));


export const sortRankCrews = (a: Crew, b: Crew, responseTimePerCrew: Map<Crew, CrewStats>) => {
    return b.blitzium - a.blitzium ||                                   // First check for Blitzium left
        b.totalBlitzium - a.totalBlitzium ||                            // Then check for total blitzium
        average(responseTimePerCrew.get(a).responseTimePerTicks) -      // Then its down to response time,
        average(responseTimePerCrew.get(b).responseTimePerTicks)        // this should sort them out.
}



