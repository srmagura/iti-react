/// <binding ProjectOpened='Watch - Development' />
var Webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const outputDir = 'wwwroot/dist';
const scriptsDir = 'Scripts';

const production = process.env.NODE_ENV === 'production';

// Makes BrowserLink work better
const cssFilenameTemplate = production ? '[name].[chunkhash]' : '[name]';

const extractTextPlugin = new ExtractTextPlugin({
    filename: outputDir + '/' + cssFilenameTemplate + '.css'
});

var commonConfig = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [scriptsDir, './node_modules']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        new Webpack.EnvironmentPlugin(['NODE_ENV'])
    ]
};

if (production) {
    commonConfig.plugins.push(new Webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false // gives tons of meaningless warnings otherwise
        }
    }));
}

var clientConfig = merge(commonConfig, {
    entry: {
        client: './' + scriptsDir + '/Client.tsx'
    },
    output: {
        filename: outputDir + '/[name].[chunkhash].js',
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    },
    externals: {
        jquery: 'jQuery',
        // This way, ReactDOM is already a global variable, which we need.
        // When React is updated, the you need to change the verison in ResourceHelpers.cs.
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        // create manifest.json which lists the compiled bundles with their chunk hash - 
        // necessary for us to be able to include the files as <script> tags
        new ManifestPlugin(),

        // only runs on a "standalone" Webpack run, not when watching files
        new CleanPlugin([outputDir]),

        // Using CommonsChunk is really only necessary if you're going to have multiple
        // entry points. Feel free to remove if you have a single entry point.
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'webpackRuntime' //But since there are no more common modules between them we end up with just the runtime code included
        }),

        extractTextPlugin,

        // Uncomment to see what's taking up space in your bundles
        //new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [{
            test: /\.scss$/,
            use: extractTextPlugin.extract(['css-loader', 'sass-loader'])
        },
        // For CSS that comes with npm packages
        {
            test: /\.css$/,
            use: extractTextPlugin.extract(['css-loader'])
        }]
    }
});

var serverConfig = merge(commonConfig,
    {
        entry: {
            server: './' + scriptsDir + '/Server.tsx'
        },
        output: {
            filename: outputDir + '/[name].js',
            libraryTarget: 'commonjs' // necessary for default export to be found
        },
        plugins: [],
        target: 'node'
    });

module.exports = [clientConfig, serverConfig];