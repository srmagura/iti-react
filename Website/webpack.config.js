/// <binding ProjectOpened='Watch - Development' />
const Webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

const outputDir = 'wwwroot/dist'
const production = process.env.NODE_ENV === 'production'

// I put this in here because I think it makes BrowserLink work better
const filenameTemplate = production ? '[name].[chunkhash]' : '[name]'

const cssExtractPlugin = new MiniCssExtractPlugin({
    filename: filenameTemplate + '.css'
})

const commonConfig = {
    mode: process.env.NODE_ENV,
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.d.ts', '.json'],
        modules: ['./Scripts', './node_modules']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    devtool: 'cheap-module-source-map',
    plugins: []
}

const clientConfig = merge(commonConfig, {
    entry: {
        client: './Scripts/Client.ts',
    },
    output: {
        path: path.resolve(__dirname, outputDir),
        filename: '[name].[chunkhash].js',
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    },
    plugins: [
        // create manifest.json which lists the compiled bundles with their chunk hash -
        // necessary for us to be able to include the files as <script> tags
        new ManifestPlugin({ fileName: 'manifest.json' }),

        // only runs on a "standalone" Webpack run, not when watching files
        new CleanPlugin([outputDir]),

        cssExtractPlugin,

        // ignore moment locales to reduce bundle size
        // reference: https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // uncomment if you want to see what's taking up space in the bundle
        // new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                // FYI: bootstrap actually gets included in main.css since it's imported from Sass
                // not TypeScript
                test: /bootstrap\/scss\/(.+)*\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS modules
                    },
                    {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            plugins: function () { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }
                ]
            },
            // Don't want to run postcss on our SCSS
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
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
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]

    }
})

const serverConfig = merge(commonConfig,
    {
        entry: './Scripts/server.ts',
        target: 'node',
        output: {
            libraryTarget: 'commonjs',
            path: path.resolve(__dirname, outputDir),
            filename: 'server.js'
        },
        plugins: []
    });

module.exports = [clientConfig, serverConfig]
