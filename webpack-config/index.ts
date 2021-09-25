import Webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { BugsnagSourceMapUploaderPlugin } from 'webpack-bugsnag-plugins'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ReactRefreshTypeScript from 'react-refresh-typescript'
import 'webpack-dev-server'

function requireOption(name: string, value: unknown): void {
    if (!value)
        throw new Error(
            '@interface-technologies/webpack-config: ' +
                `Missing required option \`${name}\`.`
        )
}

export interface WebpackConfigOptions {
    mode: 'development' | 'production'
    workspacePackageJsonPath: string
    outputPath: string

    enableBugsnagUpload: boolean
    bugsnagApiKey: string

    devServerPort: number
    enableBundleAnalyzer?: boolean
}

export default function getWebpackConfig({
    mode,
    workspacePackageJsonPath,
    outputPath,
    devServerPort,
    enableBugsnagUpload,
    bugsnagApiKey,
    enableBundleAnalyzer = false,
}: WebpackConfigOptions): Webpack.Configuration & { devServer: any } {
    requireOption('mode', mode)
    requireOption('workspacePackageJsonPath', workspacePackageJsonPath)
    requireOption('outputPath', outputPath)
    requireOption('devServerPort', devServerPort)
    requireOption('enableBugsnagUpload', enableBugsnagUpload)
    requireOption('bugsnagApiKey', bugsnagApiKey)

    const production = mode === 'production'

    const workspacePackageJson = require(workspacePackageJsonPath)

    const plugins: any[] = [
        new ForkTsCheckerWebpackPlugin(),
        new CleanWebpackPlugin({
            dry: false,
            dangerouslyAllowCleanPatternsOutsideProject: true,
        }),

        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),

        // ignore moment locales to reduce bundle size
        new Webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
    ]

    if (production) {
        if (enableBugsnagUpload) {
            plugins.push(
                new BugsnagSourceMapUploaderPlugin({
                    apiKey: bugsnagApiKey,
                    appVersion: workspacePackageJson.version,
                    publicPath: '*/dist',
                })
            )
        }
    } else {
        plugins.push(new ReactRefreshWebpackPlugin())

        if (enableBundleAnalyzer) {
            plugins.push(new BundleAnalyzerPlugin())
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
                                    before: production ? [] : [ReactRefreshTypeScript()],
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
                                : MiniCssExtractPlugin.loader,
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
    }
}
