const getLintStagedConfig = require('@interface-technologies/lint-staged-config')

module.exports = getLintStagedConfig({
    lintIgnorePatterns: '**/packages/test-website/Models/Generated/**/*',
})
