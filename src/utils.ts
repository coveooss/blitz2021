export const timeoutAfter = async (timeout: number) =>
    new Promise<void>((resolve, reject) => setTimeout(() =>
        resolve(),
        timeout
    ));