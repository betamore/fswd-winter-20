module.exports = {
    // testMatch: ['**/test/**/*-test.js' ],
    // testMatch: ['**/*-test.js' ],
    collectCoverage: true,
    coverageDirectory: "coverage",

    modulePaths: ["<rootDir>/lib/", "<rootDir>/app"],
    moduleFileExtensions: ["js", "vue"],

    roots: ["<rootDir>/lib/", "<rootDir>/app"],
    testEnvironment: "node",
    transform: {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    }
};
