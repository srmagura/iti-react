module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: ['./src/__tests__/__helpers__/jest.setup.ts'],

    timers: 'fake',
    resetMocks: true,

    // ignore files that don't have test.ts or test.tsx extension (.e.g. __helpers__)
    testMatch: ['**/__tests__/**/*.test.ts?(x)'],
}
