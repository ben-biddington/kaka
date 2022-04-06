const path = require("path");

const distPath = path.resolve(__dirname, "dist");

console.log({distPath})

module.exports = {
  mode: "development",
  entry: {
    "ui.solid": `${distPath}/src/adapters/gui/android.js/src/ui/index.jsx`,
    adapters: `${distPath}/src/adapters/gui/adapters.js`,
  },
  output: {
    path: distPath,
    filename: "[name].bundle.js",
    libraryTarget: "umd",
    globalObject: "this",
    library: "[name]",
  },
  module: {
    rules: [
      {
        use: {
          loader: "babel-loader",
          options: {
            sourceType: "unambiguous",
            presets: ["solid"],
          },
        },
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {},
  },
  stats: "verbose",
};
