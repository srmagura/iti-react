"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const webpack_bugsnag_plugins_1 = require("webpack-bugsnag-plugins");
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
const react_refresh_typescript_1 = __importDefault(require("react-refresh-typescript"));
require("webpack-dev-server");
function requireOption(name, value) {
    if (!value)
        throw new Error('@interface-technologies/webpack-config: ' +
            `Missing required option \`${name}\`.`);
}
function getWebpackConfig({ mode, workspacePackageJsonPath, outputPath, devServerPort, enableBugsnagUpload, bugsnagApiKey, enableBundleAnalyzer = false, }) {
    requireOption('mode', mode);
    requireOption('workspacePackageJsonPath', workspacePackageJsonPath);
    requireOption('outputPath', outputPath);
    requireOption('devServerPort', devServerPort);
    requireOption('enableBugsnagUpload', enableBugsnagUpload);
    requireOption('bugsnagApiKey', bugsnagApiKey);
    const production = mode === 'production';
    const workspacePackageJson = require(workspacePackageJsonPath);
    const plugins = [
        new fork_ts_checker_webpack_plugin_1.default(),
        new clean_webpack_plugin_1.CleanWebpackPlugin({
            dry: false,
            dangerouslyAllowCleanPatternsOutsideProject: true,
        }),
        new mini_css_extract_plugin_1.default({
            filename: '[name].[contenthash].css',
        }),
        // ignore moment locales to reduce bundle size
        new webpack_1.default.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
    ];
    if (production) {
        if (enableBugsnagUpload) {
            plugins.push(new webpack_bugsnag_plugins_1.BugsnagSourceMapUploaderPlugin({
                apiKey: bugsnagApiKey,
                appVersion: workspacePackageJson.version,
                publicPath: '*/dist',
            }));
        }
    }
    else {
        plugins.push(new react_refresh_webpack_plugin_1.default());
        if (enableBundleAnalyzer) {
            plugins.push(new webpack_bundle_analyzer_1.BundleAnalyzerPlugin());
        }
    }
    return {
        mode,
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            modules: ['./src', './node_modules'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                getCustomTransformers: () => ({
                                    before: production ? [] : [(0, react_refresh_typescript_1.default)()],
                                }),
                            },
                        },
                    ],
                },
                {
                    test: /\.s?css$/,
                    use: [
                        {
                            loader: !production
                                ? 'style-loader'
                                : mini_css_extract_plugin_1.default.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: ['autoprefixer'],
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpg)$/,
                    type: 'asset/resource',
                },
            ],
        },
        output: {
            // chunkhash is necessary to prevent browser from caching
            chunkFilename: '[name].[chunkhash].js',
            path: outputPath,
            publicPath: '/dist/',
            devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
        },
        devtool: production ? 'source-map' : 'cheap-module-source-map',
        plugins,
        devServer: {
            port: devServerPort,
            allowedHosts: 'all',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    };
}
exports.default = getWebpackConfig;
