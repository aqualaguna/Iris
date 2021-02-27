var webpack = require("webpack");

module.exports = {
  publicPath: "/",
  transpileDependencies: ["vue-echarts", "resize-detector"],
  outputDir: "../dist/cms",
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        "window.Quill": "quill/dist/quill.js",
        Quill: "quill/dist/quill.js",
      }),
    ],
  },
  runtimeCompiler: true,
  // devServer: {
  //   overlay: {
  //     warnings: true,
  //     errors: true
  //   }
  // }
};
