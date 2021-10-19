module.exports = {
    testEnvironment: 'jsdom',
    testTimeout: 15000,

    timers: 'fake',
    resetMocks: true,

    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/__TestHelpers__/CssStub.cjs',
    },
    setupFilesAfterEnv: ['<rootDir>/src/__TestHelpers__/jest.setup.ts'],

    testMatch: ['**/*.test.ts?(x)'],
}
