const nodeExternals = require("webpack-node-externals");
const slws = require("serverless-webpack");

const isLocal = slws.lib.webpack.isLocal;


module.exports = {
    ...(isLocal && { devtool: "inline-cheap-module-source-map" }),
    entry: slws.lib.entries,
    mode: isLocal ? "development" : "production",
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.ts$/,
                use: "ts-loader",
            },
        ],
    },
    node: true,
    externals: [nodeExternals()],
    optimization: {
        minimize: true
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    target: "node",
};