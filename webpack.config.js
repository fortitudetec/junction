const path = require('path');
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  vendor: path.join(__dirname, 'dist/vendor'),
  nodeModules: path.join(__dirname, "node_modules")
}

module.exports = {
  entry: {
    app: path.join(PATHS.app, "app.jsx")
  },
  resolve: {
    alias: {
      jquery: 'jquery/dist/jquery.min.js'
    },
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.dist,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      'jQuery': 'jquery',
      '$': 'jquery'
    }),
    new webpack.optimize.DedupePlugin()
  ],
  module: {
    loaders: [ 
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory,presets[]=react,presets[]=es2015'],
        include: [PATHS.app, PATHS.vendor]
      },
      { 
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "url-loader?limit=10000&minetype=application/font-woff",
        include: [PATHS.app, PATHS.vendor, PATHS.nodeModules] 
      },
      { 
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "file-loader",
        include: [PATHS.app, PATHS.vendor, PATHS.nodeModules]
      },
      {
        test: /.json$/,
        loader: "json-loader"
      },
      {
        test: /\.png$/,
        loader: "file-loader",
      }
    ]
  }
}