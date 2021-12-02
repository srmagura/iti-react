module.exports = {
    testEnvironment: 'jsdom',
    testTimeout: 30000,

    timers: 'fake',
    resetMocks: true,

    testMatch: ['**/*.test.ts?(x)'],

    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
}
