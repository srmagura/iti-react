module.exports = {
    testEnvironment: 'jsdom',

    timers: 'real',
    resetMocks: true,

    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/__tests__/__helpers__/CssStub.js',
    },

    // ignore files that don't have test.ts or test.tsx extension (.e.g. __helpers__)
    testMatch: ['**/__tests__/**/*.test.ts?(x)'],
}
