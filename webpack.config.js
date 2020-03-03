const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    entry: "./app/app.js",
    output: {
        filename: "dist.js",
        path: path.resolve(__dirname, "public")
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js" // 'vue/dist/vue.common.js' for webpack 1
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.vue$/,
                use: ["vue-loader"]
            }
        ]
    },
    devtool: "inline-source-map",
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
    ]
};
