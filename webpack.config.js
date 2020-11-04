const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const fs = require('fs');

const devMode = process.env.NODE_ENV !== 'production';
const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

var dirWalk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.join(dir, file);
      fs.stat(file, function (err, stat) {
        if (err) throw err;
        if (stat && stat.isDirectory()) {
          results.push(file);
          dirWalk(file, function (err, res) {
            if (err) throw err;
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

module.exports = () => {
  return new Promise(resolve => {
    dirWalk('./src', function (err, results) {
      if (err) throw err;
      let dirCount = results.length;
      asyncForEach(results, async directory => {
        await waitFor(50);
        dirCount--;
        if (dirCount <= 0) {
          await waitFor(50);
          resolve({
            entry: {
              index: './src/js/index.js'
            },
            devtool: 'inline-source-map',
            devServer: {
              before: function (app, server) {
                app.get('*/index.html', function (req, res, next) {
                  res.redirect(req.originalUrl.split('index.html').shift());
                });
              }
            },
            optimization: {
              minimizer: [
                new MinifyPlugin({}),
                new OptimizeCSSAssetsPlugin({})
              ]
            },
            output: {
              filename: 'js/[name].js',
              path: path.join(__dirname, '/dist')
            },
            plugins: [
              new CleanWebpackPlugin(),
              new SpritesmithPlugin({
                src: {
                  cwd: path.resolve(__dirname, 'src/sprites'),
                  glob: '*.png'
                },
                target: {
                  image: path.resolve(__dirname, 'src/images/sprite.png'),
                  css: path.resolve(__dirname, 'src/scss/_sprite.scss')
                },
                apiOptions: {
                  cssImageRef: '../images/sprite.png'
                }
              }),
              new CopyWebpackPlugin([
                { from: 'src/images', to: 'images' },
                { from: 'src/files', to: 'files' }
              ]),
              new MiniCssExtractPlugin({
                filename: 'css/styles.css'
              }),
              new webpack.ProvidePlugin({
                /* Use when importing individual BS components */
                // '$': 'jquery/dist/jquery.slim.js',
                // 'jQuery': 'jquery/dist/jquery.slim.js',
                // 'Popper': 'popper.js/dist/umd/popper', /* required for tooltips */
                // 'Util': 'exports-loader?Util!bootstrap/js/dist/util'
              }),
              new HtmlWebpackPlugin({
                template: './src/index.pug',
                filename: 'index.html'
              }),
              new HtmlWebpackPlugin({
                template: './src/presale.pug',
                filename: 'presale.html'
              }),
              new HtmlWebpackPlugin({
                template: './src/tmp.pug',
                filename: 'tmp.html'
              }),
              new HtmlWebpackPugPlugin(),
              new FaviconsWebpackPlugin({
                logo: path.join(__dirname, 'src/images/logo48.png'),
                publicPath: './',
                prefix: 'favicons',
                cache: false,
                inject: true,
                favicons: {
                  background: '#fff',
                  icons: {
                    android: !devMode,
                    appleIcon: !devMode,
                    appleStartup: !devMode,
                    coast: !devMode,
                    favicons: true,
                    firefox: !devMode,
                    opengraph: !devMode,
                    twitter: !devMode,
                    yandex: !devMode,
                    windows: !devMode
                  }
                }
              }),
              new WriteFilePlugin(),
              new CompressionPlugin()
            ],
            module: {
              rules: [
                {
                  test: /\.(sa|sc|c)ss$/,
                  use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?url=false', // translates CSS into CommonJS modules
                    {
                      loader: 'postcss-loader', // Run post css actions
                      options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                          return [
                            require('precss'),
                            require('autoprefixer')
                          ];
                        }
                      }
                    },
                    'sass-loader' // compiles Sass to CSS
                  ]
                },
                {
                  test: /\.js$/,
                  exclude: /node_modules/,
                  use: [
                    'babel-loader'
                  ]
                },
                {
                  test: /\.(png|svg|jpg|jpeg|gif)$/,
                  use: {
                    loader: 'file-loader',
                    options: {
                      name: '[path][name].[ext]'
                    }
                  }
                },
                {
                  test: /\.(woff|woff2|eot|ttf|otf)$/,
                  use: {
                    loader: 'file-loader',
                    options: {
                      name: '[path][name].[ext]'
                    }
                  }
                },
                {
                  test: /\.pug$/,
                  use: ['pug-loader']
                }
              ]
            },
            node: {
              fs: 'empty'
            }
          });
        }
      });
    });
  });
};
