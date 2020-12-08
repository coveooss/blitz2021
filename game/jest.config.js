module.exports = {
    moduleFileExtensions: [
        "ts", "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/*.test.ts"
    ],
    testEnvironment: "node"
};