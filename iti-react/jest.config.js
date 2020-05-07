module.exports = {
    preset: 'ts-jest',
    transformIgnorePatterns: ["node_modules/(?!@interface-technologies)"],

    // ignore files that don't have test.ts or test.tsx extension (.e.g. __helpers__)
    testMatch: ['**/__tests__/**/*.test.ts?(x)']
}
