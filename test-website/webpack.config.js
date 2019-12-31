const Webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

// CSS MINIFICATION IS NOT WORKING
// It looks like css-loader removed that as an option. I'm just going to wait until Webpack 5 which 
// supposedly will have a built-in CSS minifier.

const outputDir = '../TestWebsite/wwwroot/dist'

const cssExtractPlugin = new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'
})

module.exports = env => {
    const production = !!(env && env.prod)

    const cssModuleRules = [
        {
            test: /bootstrap\/scss\/(.+)*\.(scss)$/,
            use: [
                {
                    loader: !production ? 'style-loader' : MiniCssExtractPlugin.loader
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
                    loader: !production ? 'style-loader' : MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
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
            modules: ['./src', './node_modules']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                },
            ].concat(cssModuleRules)
        },
        output: {
            filename: '[name].js',
            // chunkhash is necessary to prevent browser from caching
            chunkFilename: '[name].[chunkhash].js',
            path: path.resolve(__dirname, outputDir),
            publicPath: 'dist/',
            devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
        },
        devtool: 'cheap-module-source-map',
        plugins: [
            new CleanWebpackPlugin(
                {
                    verbose: false,
                    dry: false,
                    dangerouslyAllowCleanPatternsOutsideProject: true,
                }),

            cssExtractPlugin,

            // ignore moment locales to reduce bundle size
            new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

            // uncomment if you want to see what's taking up space in the bundle
            //new BundleAnalyzerPlugin()
        ],
        devServer: {
            port: 51644,
            headers: { 'Access-Control-Allow-Origin': '*' },
        }
    }
}
