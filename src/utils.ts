export const timeoutAfter = async (timeout: number) =>
    new Promise((resolve, reject) => setTimeout(() =>
        resolve(),
        timeout
    ));