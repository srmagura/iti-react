const Webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const cssExtractPlugin = new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'
})

module.exports = env => {
    const production = !!(env && env.prod)

    const cssModuleRules = [
        {
            test: /\.(scss)$/,
            use: [
                {
                    loader: !production ? 'style-loader' : MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    }
                },
                {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        postcssOptions: {
                            plugins: ['autoprefixer']
                        }
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        },
        // For CSS that comes with npm packagse
        {
            test: /\.css$/,
            use: [
                {
                    loader: !production ? 'style-loader' : MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader'
                }
            ]
        }
    ]


    return {
        mode: production ? 'production' : 'development',
        entry: {
            app: './src/App.tsx',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            modules: ['./src', 'node_modules']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader', options: {
                                transpileOnly: true,
                                getCustomTransformers: () => ({
                                    before: production ? [] : [ReactRefreshTypeScript()],
                                }),
                            }
                        }
                    ]
                },
            ].concat(cssModuleRules)
        },
        output: {
            filename: '[name].js',
            // chunkhash is necessary to prevent browser from caching
            chunkFilename: '[name].[chunkhash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist/',
            devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
        },
        devtool: 'cheap-module-source-map',
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new CleanWebpackPlugin({
                dry: false,
                dangerouslyAllowCleanPatternsOutsideProject: true
            }),

            cssExtractPlugin,
            new ReactRefreshWebpackPlugin(),

            // uncomment if you want to see what's taking up space in the bundle
            //new BundleAnalyzerPlugin()
        ],
        devServer: {
            port: 51644,
            liveReload: false,
            headers: { 'Access-Control-Allow-Origin': '*' },
        }
    }
}
