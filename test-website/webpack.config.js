const path = require('path')
const getWebpackConfig = require('@interface-technologies/webpack-config')

module.exports = (_, argv) => {
    return {
        ...getWebpackConfig({
            mode: argv.mode,
            workspacePackageJsonPath: '../package.json',
            outputPath: path.resolve(__dirname, 'dist'),

            enableBugsnagUpload: false,
            bugsnagApiKey: 'none',

            devServerPort: 51644,
            enableBundleAnalyzer: false,
        }),
        entry: {
            app: path.resolve(__dirname, './src/App.tsx'),
        },
    }
}
