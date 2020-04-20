var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
let HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
let ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
let CopyWebpackPlugin = require("copy-webpack-plugin");

let { matchCssRule, matchFontsRule, matchTsRule } = require("./shared");
let splitChunks = require("./split-chunks");
let dllManifest = require("./dll/manifest.json");

module.exports = {
  mode: "development",
  entry: ["webpack-hud", "./example/main.tsx"],
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist"),
  },
  devtool: "cheap-source-map",
  module: {
    rules: [matchCssRule, matchFontsRule, matchTsRule],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.join(__dirname, "../example"), "node_modules"],
  },
  externals: {
    fs: true,
    path: true,
  },
  devServer: {
    contentBase: __dirname,
    publicPath: "/",
    compress: true,
    clientLogLevel: "info",
    disableHostCheck: true,
    host: "0.0.0.0",
    stats: {
      all: false,
      colors: true,
      errors: true,
      errorDetails: true,
      performance: true,
      reasons: true,
      timings: true,
      warnings: true,
    },
  },
  optimization: {
    minimize: false,
    namedModules: true,
    chunkIds: "named",
    splitChunks: splitChunks,
  },
  plugins: [
    new webpack.DefinePlugin({
      GlobalZxingWasmPath: JSON.stringify("wasm/zxing-go.wasm"),
    }),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true, async: false }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "dll/manifest.json"),
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.ejs",
      trackingCode: "",
    }),
    new CopyWebpackPlugin([{ from: "node_modules/zbar.wasm/data/zbar.wasm", to: "wasm/" }], {}),
    new CopyWebpackPlugin([{ from: "src/assets/zxing-go.wasm", to: "wasm/" }], {}),
    new HtmlWebpackTagsPlugin({
      tags: [`dll/${dllManifest.name}.js`],
      append: false,
    }),
  ],
};
