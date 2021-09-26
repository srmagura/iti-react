module.exports = {
    testEnvironment: 'jsdom',
    testTimeout: 15000,

    timers: 'fake',
    resetMocks: true,

    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/__tests__/__helpers__/CssStub.js',
    },
    transformIgnorePatterns: ['node_modules/(?!@interface-technologies)'],
    setupFiles: ['<rootDir>/src/__tests__/__helpers__/jest.setup.ts'],

    // ignore files that don't have test.ts or test.tsx extension (.e.g. __helpers__)
    testMatch: ['**/__tests__/**/*.test.ts?(x)'],
}
