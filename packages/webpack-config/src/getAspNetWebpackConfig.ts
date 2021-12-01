import Webpack, { WebpackPluginInstance } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { BugsnagSourceMapUploaderPlugin } from 'webpack-bugsnag-plugins'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import 'webpack-dev-server'
import { requireOption } from './requireOption'

interface WebpackConfigOptions {
    mode?: 'development' | 'production'
    appVersion: string
    outputPath: string

    enableBugsnagUpload: boolean
    bugsnagApiKey: string

    devServerPort: number
    enableBundleAnalyzer?: boolean
}

export function getAspNetWebpackConfig({
    mode = 'development',
    appVersion,
    outputPath,
    devServerPort,
    enableBugsnagUpload,
    bugsnagApiKey,
    enableBundleAnalyzer = false,
}: WebpackConfigOptions): Webpack.Configuration & { devServer: unknown } {
    requireOption('appVersion', appVersion)
    requireOption('outputPath', outputPath)
    requireOption('devServerPort', devServerPort)
    requireOption('enableBugsnagUpload', enableBugsnagUpload)
    requireOption('bugsnagApiKey', bugsnagApiKey)

    const production = mode === 'production'

    const plugins: WebpackPluginInstance[] = [
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

    if (enableBundleAnalyzer) {
        plugins.push(new BundleAnalyzerPlugin())
    }

    if (production) {
        if (enableBugsnagUpload) {
            plugins.push(
                new BugsnagSourceMapUploaderPlugin({
                    apiKey: bugsnagApiKey,
                    appVersion,
                    publicPath: '*/dist',
                }) as WebpackPluginInstance
            )
        }
    } else {
        plugins.push(new ReactRefreshWebpackPlugin())
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
                    use: require.resolve('swc-loader'),
                },
                {
                    test: /\.s?css$/,
                    use: [
                        {
                            loader: !production
                                ? require.resolve('style-loader')
                                : MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                postcssOptions: {
                                    plugins: [require.resolve('autoprefixer')],
                                    implementation: require.resolve('postcss'),
                                },
                            },
                        },
                        {
                            loader: require.resolve('sass-loader'),
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
