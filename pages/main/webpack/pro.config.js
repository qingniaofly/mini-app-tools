const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./common.config')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(commonConfig, {
        plugins: [
            // new CleanWebpackPlugin([BUILD_PATH]),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                },
            })
        ],
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: 4,
                    exclude: /node_modules/,
                    cache: false,
                    uglifyOptions: {
                        output: {
                            comments: false,
                            beautify: false,
                        },
                    },
                }),
            ],
        },
        mode: 'production',
    }
)