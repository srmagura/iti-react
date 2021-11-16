const getLintStagedConfig = require('@interface-technologies/lint-staged-config')

module.exports = getLintStagedConfig({ lintIgnorePath: '**/packages/test-website/**/*' })
