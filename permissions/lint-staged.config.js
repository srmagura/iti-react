const getLintStagedConfig = require('@interface-technologies/lint-staged-config')

module.exports = getLintStagedConfig({ lintIgnorePatterns: ['**/__tests__/**/*'] })
