const path = require('path')
const HTMLwebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development';


module.exports = {

    entry: { 
        app: [
            path.resolve(__dirname, './src/style.css'),
            path.resolve(__dirname, './src/index.js'),
        ]
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new HTMLwebpackPlugin({
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : '[name].[contenthash].css',
        }),

    ],
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                use:                     
                    {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: /\.module\.\w+$/i,
                                localIdentName: '[local]--[hash:base64:5]'
                            },
                        }
                      }
                ]    
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, './dist'),
          },
        historyApiFallback: true,
    }

}