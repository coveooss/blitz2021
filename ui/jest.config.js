module.exports = {
    moduleFileExtensions: ["ts", "tsx", "js"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testRegex: [
        "^.+\\.test\.(ts|tsx)$"
    ],
    testEnvironment: "jsdom",
    coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
    collectCoverageFrom: ["**/*.{ts,tsx}"]
};
