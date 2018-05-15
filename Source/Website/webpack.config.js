const Webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

const outputDir = 'wwwroot/dist'

const cssExtractPlugin = new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'
})

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer)
    } else if (m.name) {
        return m.name
    } else {
        return false
    }
}

module.exports = env => {
    const production = !!(env && env.prod)

    const scriptsDir = './Client/Scripts'

    const cssModuleRules = [
        {
            test: /bootstrap\/scss\/(.+)*\.(scss)$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                    options: {
                        minimize: production
                    }
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
                        minimize: production,
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
                    loader: 'css-loader',
                    options: {
                        minimize: production
                    }
                }
            ]
        }
    ]


    return {
        mode: production ? 'production' : 'development',
        entry: {
            app: scriptsDir + '/App.tsx',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.d.ts', '.json'],
            modules: [scriptsDir, './node_modules']
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
            new CleanPlugin([outputDir]),

            cssExtractPlugin,

            // ignore moment locales to reduce bundle size
            new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

            // uncomment if you want to see what's taking up space in the bundle
            //new BundleAnalyzerPlugin()
        ],
    }
}
