const path = require('path')
const Webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
    const mode = argv.mode ?? 'development'
    const production = mode === 'production'

    const plugins = [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
        }),

        new ForkTsCheckerWebpackPlugin(),
        new CleanWebpackPlugin(),

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
        if (env.enableBugsnagUpload) {
            plugins.push(
                new BugsnagSourceMapUploaderPlugin({
                    apiKey: BUGSNAG_API_KEY,
                    appVersion,
                })
            )
        }
    } else {
        plugins.push(new ReactRefreshWebpackPlugin())
    }

    return {
        mode,
        entry: {
            app: path.resolve(__dirname, 'src/index.tsx'),
        },
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
            // chunkhash is necessary to prevent browser using a cached file when the code has changed
            filename: '[name].[chunkhash].js',

            path: path.resolve(__dirname, 'dist'),
            devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
        },
        devtool: production ? 'source-map' : 'cheap-module-source-map',
        plugins,
        devServer: {
            port: 5278,
            historyApiFallback: true,
            proxy: {
                '/api': 'http://localhost:5277',
            },
        },
    }
}
