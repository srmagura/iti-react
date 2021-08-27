module.exports = {
    testEnvironment: 'jsdom',

    transform: { "\\.tsx?$": "@sucrase/jest-plugin" },

    // ignore files that don't have test.ts or test.tsx extension (.e.g. __helpers__)
    testMatch: ["**/__tests__/**/*.test.ts?(x)"]
}