const base = require('@interface-technologies/jest-config')

module.exports = {
    ...base,

    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },

    rootDir: '..',
    moduleNameMapper: {
        '\\.css$': '<rootDir>/scripts/cssStub.js',
    },
    setupFilesAfterEnv: ['<rootDir>/scripts/jest.setup.js'],
}
