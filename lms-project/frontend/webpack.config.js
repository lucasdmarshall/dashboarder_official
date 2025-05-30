const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.[contenthash].js',
      publicPath: '/',
      crossOriginLoading: 'anonymous'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: isProduction 
                ? [] 
                : [require.resolve('react-refresh/babel')]
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.webm$/,
          use: 'file-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      ...(isProduction ? [] : [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin()
      ])
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: {
      static: path.join(__dirname, 'public'),
      compress: true,
      port: 3001,
      hot: true,
      historyApiFallback: true,
      open: true,
      onBeforeSetupMiddleware: function (devServer) {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        devServer.app.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Content-Security-Policy', "default-src 'self' * 'unsafe-inline' 'unsafe-eval'; script-src 'self' * 'unsafe-inline' 'unsafe-eval'; connect-src 'self' * 'unsafe-inline' data:; style-src 'self' * 'unsafe-inline'; img-src 'self' * data: blob: 'unsafe-inline';");
          next();
        });
      },
    }
  };
};
