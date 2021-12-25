import { resolve } from "path";
import { Configuration } from "webpack";
import { ENTRY_PATH, ENV, OUTPUT_PATH } from "./types";

const NodemonWebpackPlugin = require("nodemon-webpack-plugin");
const NodeExternals = require("webpack-node-externals");

const isDev = process.env.NODE_ENV === ENV.DEV;

const config: Configuration = {
  target: "node",
  mode: isDev ? ENV.DEV : ENV.PROD,
  entry: {
    server: resolve(ENTRY_PATH.APP),
  },
  output: {
    clean: true,
    path: resolve(OUTPUT_PATH.APP),
  },
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  externals: [NodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
      },
    ],
  },
  plugins: [new NodemonWebpackPlugin()],
};

module.exports = config;
