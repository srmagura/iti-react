const base = require('@interface-technologies/jest-config')

module.exports = {
    ...base,

    rootDir: '..',
    //modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/scripts/cssStub.js',
    },
    setupFilesAfterEnv: ['<rootDir>/scripts/jest.setup.js'],
}
