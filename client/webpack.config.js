const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  mode: "development",
  resolve: {
    extensions: [".js", ".vue", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.vue?$/,
        loader: "vue-loader"
      },
      {
        test: /\.js?$/,
        loader: "babel-loader"
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: "./src/index.html" })
  ],
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080"
      }
    }
  }
};
