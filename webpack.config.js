const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: "./Main.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[contenthash].js",
        path: path.resolve(__dirname, "build"),
    },
    devServer: {
        port: 4200,
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: process.env.NODE_ENV !== "development",
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, "assets/dist"), to: path.resolve(__dirname, "build/assets") }
        ]),
    ],
};
