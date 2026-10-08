// Karma + Jasmine + webpack/Babel.
//   npm test              -> una pasada en Chrome sin ventana (ChromeHeadlessCI)
//   npm run test:watch    -> Chrome con ventana, se re-ejecuta al guardar
//   npm run test:cov      -> una pasada + reporte de cobertura en coverage/
//   npm run test:jsdom    -> sin Chrome instalado (usa jsdom); util en PCs sin navegador
//
// Todas las pruebas entran por src/test/index.js (un solo bundle de webpack).
const webpack = require("webpack");

const conCobertura = process.env.COVERAGE === "1";

const webpackConfig = {
  mode: "development",
  devtool: "inline-source-map",
  resolve: { extensions: [".js", ".jsx", ".json"] },
  module: {
    rules: [
      // package.json tiene "type": "module": webpack exigiria extensiones en los imports.
      // El codigo del proyecto importa sin extension (como Vite), asi que se relaja esa regla.
      { test: /\.m?js$/, resolve: { fullySpecified: false } },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // Con cobertura, istanbul instrumenta el codigo propio (no las pruebas).
            plugins: conCobertura ? [["istanbul", { exclude: ["**/*.spec.js", "**/*.spec.jsx", "src/test/**"] }]] : [],
          },
        },
      },
      // CSS, fuentes e imagenes no aportan nada a una prueba unitaria: se importan vacios.
      { test: /\.(css|woff2?|ttf|eot|png|jpe?g|gif|svg|webp|mp4)$/i, use: "null-loader" },
    ],
  },
  plugins: [
    // Vite expone import.meta.env; webpack no. Se define aqui para que services/api.js funcione en pruebas.
    new webpack.DefinePlugin({
      "import.meta.env": JSON.stringify({ VITE_API_URL: "http://localhost:8080/api", MODE: "test" }),
      "process.env.COVERAGE": JSON.stringify(conCobertura ? "1" : "0"),
    }),
  ],
  performance: { hints: false },
};

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    plugins: [
      require("karma-jasmine"),
      require("karma-webpack"),
      require("karma-sourcemap-loader"),
      require("karma-spec-reporter"),
      require("karma-coverage"),
      require("karma-chrome-launcher"),
      require("karma-jsdom-launcher"),
    ],
    files: [{ pattern: "src/test/index.js", watched: false }],
    preprocessors: { "src/test/index.js": ["webpack", "sourcemap"] },
    webpack: webpackConfig,

    reporters: conCobertura ? ["spec", "coverage"] : ["spec"],
    specReporter: { suppressSkipped: false, showSpecTiming: false },
    coverageReporter: {
      dir: "coverage",
      reporters: [{ type: "text-summary" }, { type: "html", subdir: "html" }, { type: "lcov", subdir: "lcov" }],
    },

    browsers: ["ChromeHeadlessCI"],
    customLaunchers: {
      // --no-sandbox permite correr Chrome en contenedores y CI; en tu PC no molesta.
      ChromeHeadlessCI: { base: "ChromeHeadless", flags: ["--no-sandbox"] },
    },

    client: {
      // clearContext:false deja el resultado visible en el navegador del modo watch.
      clearContext: false,
      jasmine: { random: true }, // orden aleatorio: destapa pruebas que dependen unas de otras
    },
    browserNoActivityTimeout: 60000,
    singleRun: false,
    restartOnFileChange: true,
  });
};
