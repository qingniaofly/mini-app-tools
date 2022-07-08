const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./common.config')

module.exports = merge(commonConfig, {
        devtool: 'inline-source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development')
                },
            })
        ],
        mode: 'development',
    }
)