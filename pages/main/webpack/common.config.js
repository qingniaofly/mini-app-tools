/* eslint-disable  */
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: {
        main: path.resolve(__dirname, '../src/index.tsx')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../build'),
        // publicPath: './'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: { 
            "path": require.resolve("path-browserify") 
        },
        alias: {
            // sdk: path.resolve(__dirname, './service'),
            // "path": require.resolve("path-browserify")
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)?$/,
                use: [
                    {
                        loader:'babel-loader',
                        options: {
                            // cacheDirectory: true,
                            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                            // plugins: ['@babel/plugin-transform-runtime'],
                            compact: process.env.NODE_ENV === 'production'
                        }
                    }
                ]
            },
            // {
            //     test: /\.(ts|tsx)?$/,
            //     exclude: /node_modules/,
            //     use: [
            //         {
            //             loader: 'awesome-typescript-loader',
            //             options: {
            //                 transpileOnly: true,
            //             },
            //         }
            //     ]
            // },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        // options: {
                        //     publicPath: '../',
                        // }
                    },
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        // options: {
                        //     publicPath: '../',
                        // },
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false
                        },
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        // options: {
                        //     publicPath: '../',
                        // }
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(gif|jpg?g|png|svg|woff|eot|ttf|ico)\??.*$/,
                loader: 'url-loader',
                options: {
                    limit: 100,
                    name: '../public/images/[name].[ext]'
                }
            }
        ],
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     path: 'path'
        // }),
        // // new CleanWebpackPlugin([BUILD_PATH]),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         CLIENT_ENV: JSON.stringify('client'),
        //         IS_MAC_ENV: JSON.stringify(process.env.IS_MAC || ''), //定义编译环境
        //     },
        // })
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname,'../public/static'),
                    to: 'static',
                }
            ]
        }),
        new HtmlWebpackPlugin({
            title: "app",
            // inject: true,
            inject: 'body',
            showErrors: true,
            template: path.resolve(__dirname, '../public/index.html')
        }),

    ],
    optimization: {
        minimize: false,
        splitChunks: {
            // chunks: 'all',
            // minChunks: 2,
            // name: 'vendor',
            cacheGroups: {
                antd: {
                    chunks: "all",
                    test: /antd|@ant-design|rc-\S+|moment/,
                    name: 'antd',
                    priority: 30
                },
                vendor: {
                    chunks: "all",
                    test:  /react|react-dom|lodash|redux|md5|prop-types|react-redux|rxjs/,
                    name: "vendor",
                    priority: 30,
                }
            }
        }
    },
    stats: "errors-only",
    externals:{
    }
}
