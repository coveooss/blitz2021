
export const waitForPromiseResolution = () => new Promise((resolve, reject) => setImmediate(resolve));