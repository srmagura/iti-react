module.exports = {
    testEnvironment: 'jsdom',

    timers: 'fake',
    resetMocks: true,

    // ignore files that don't have test.ts or test.tsx extension (.e.g. __helpers__)
    testMatch: ['**/__tests__/**/*.test.ts?(x)'],
}
