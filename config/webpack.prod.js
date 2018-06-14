/**
 * @author: @vincent-cm
 */
const helpers = require('./helpers');
const buildUtils = require('./build-utils');

/**
 * Used to merge webpack configs
 */
const webpackMerge = require('webpack-merge');
/**
 * The settings that are common to prod and dev
 */
const commonConfig = require('./webpack.common.js');

/**
 * Webpack Plugins
 */
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BabelEnginePlugin = require('babel-engine-plugin');
/***
 * Ref: https://github.com/mishoo/UglifyJS2/tree/harmony#minify-options
 * @param supportES2015
 * @param enableCompress disabling compress could improve the performance, see https://github.com/webpack/webpack/issues/4558#issuecomment-352255789
 * @returns {{ecma: number, warnings: boolean, ie8: boolean, mangle: boolean, compress: {pure_getters: boolean, passes: number}, output: {ascii_only: boolean, comments: boolean}}}
 */
function getUglifyOptions(supportES2015, enableCompress) {
  const uglifyCompressOptions = {
    pure_getters: true /* buildOptimizer */ ,
    // PURE comments work best with 3 passes.
    // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
    passes: 2 /* buildOptimizer */
  };

  return {
    ecma: supportES2015 ? 6 : 5,
    warnings: false, // TODO verbose based on option?
    ie8: false,
    mangle: true,
    compress: enableCompress ? uglifyCompressOptions : false,
    output: {
      ascii_only: true,
      comments: false
    }
  };
}

module.exports = function (env) {
  const ENV = (process.env.NODE_ENV = process.env.ENV = 'production');
  const supportES2015 = buildUtils.supportES2015(
    buildUtils.DEFAULT_METADATA.tsConfigPath
  );
  const sourceMapEnabled = process.env.SOURCE_MAP === '0';
  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3004,
    ENV: ENV,
    HMR: false
  });

  // set environment suffix so these environments are loaded.
  METADATA.envFileSuffix = METADATA.E2E ? 'e2e.prod' : 'prod';

  return webpackMerge(
    commonConfig({
      env: ENV,
      metadata: METADATA
    }), {
      /**
       * Options affecting the output of the compilation.
       *
       * See: https://webpack.js.org/configuration/output/
       */
      output: {
        /**
         * The output directory as absolute path (required).
         *
         * See: https://webpack.js.org/configuration/output/#output-path
         */
        path: helpers.root('dist'),

        /**
         * Specifies the name of each output file on disk.
         * IMPORTANT: You must not specify an absolute path here!
         *
         * See: https://webpack.js.org/configuration/output/#output-filename
         */
        filename: '[name].[chunkhash].bundle.js',

        /**
         * The filename of the SourceMaps for the JavaScript files.
         * They are inside the output.path directory.
         *
         * See: https://webpack.js.org/configuration/output/#output-sourcemapfilename
         */
        sourceMapFilename: '[file].map',

        /**
         * The filename of non-entry chunks as relative path
         * inside the output.path directory.
         *
         * See: https://webpack.js.org/configuration/output/#output-chunkfilename
         */
        chunkFilename: '[name].[chunkhash].chunk.js'
      },

      module: {
        rules: [
          /**
           * Extract CSS files from .src/styles directory to external CSS file
           */
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  minimize: {
                    safe: true
                  },
                  importLoaders: 2,
                  sourceMap: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [require('autoprefixer')],
                  sourceMap: true
                }
              }
            ],
            include: [helpers.root('src', 'styles')]
          },
          {
            test: /\.s?[ac]ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  minimize: {
                    safe: true
                  },
                  importLoaders: 2,
                  sourceMap: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [require('autoprefixer')],
                  sourceMap: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ],
            include: [helpers.root('src', 'styles')]
          },
          {
            test: /\.less$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  minimize: {
                    safe: true
                  },
                  importLoaders: 2,
                  sourceMap: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [require('autoprefixer')],
                  sourceMap: true
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true
                }
              }
            ],
            include: [helpers.root('src', 'styles')]
          }
        ]
      },

      // optimization: {
      //   minimizer: [
      //     new UglifyJsPlugin({
      //       sourceMap: true,
      //       cache: true,
      //       parallel: true,
      //       uglifyOptions: getUglifyOptions(supportES2015)
      //     }),
      //     new OptimizeCSSAssetsPlugin({})
      //   ],
      //   splitChunks: {
      //     cacheGroups: {
      //       styles: {
      //         name: 'styles',
      //         test: /\.css$/,
      //         chunks: 'all',
      //         enforce: true
      //       }
      //     }
      //   }
      // },

      /**
       * Add additional plugins to the compiler.
       *
       * See: https://webpack.js.org/configuration/plugins/
       */
      plugins: [
        new SourceMapDevToolPlugin({
          filename: '[file].map[query]',
          moduleFilenameTemplate: '[resource-path]',
          fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
          sourceRoot: 'webpack:///'
        }),

        /**
         * Plugin: MiniCssExtractPlugin
         * Description: Extracts imported CSS files into external stylesheet
         *
         * See: https://github.com/webpack-contrib/mini-css-extract-plugin
         */
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].css'
        }),

        new PurifyPlugin() /* buildOptimizer */ ,

        new HashedModuleIdsPlugin(),

        /**
         * Plugin: UglifyJsPlugin
         * Description: Minimize all JavaScript output of chunks.
         * Loaders are switched into minimizing mode.
         *
         * See: https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
         *
         * NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
         */
        new UglifyJsPlugin({
          sourceMap: sourceMapEnabled,
          parallel: true,
          cache: helpers.root('webpack-cache/uglify-cache'),
          uglifyOptions: getUglifyOptions(supportES2015, true)
        }),

        new BabelEnginePlugin(), 

        /**
         * Plugin: CompressionPlugin
         * Description: Prepares compressed versions of assets to serve
         * them with Content-Encoding
         *
         * See: https://github.com/webpack/compression-webpack-plugin
         */
        //  install compression-webpack-plugin
        new CompressionPlugin({
          test: /\.css$|\.html$|\.js$|\.map$/,
          threshold: 2 * 1024
        })
      ],

      /**
       * Include polyfills or mocks for various node stuff
       * Description: Node configuration
       *
       * See: https://webpack.js.org/configuration/node/
       */
      node: {
        global: true,
        crypto: 'empty',
        process: false,
        module: false,
        clearImmediate: false,
        setImmediate: false,
        fs: 'empty'
      }
    }
  );
};
