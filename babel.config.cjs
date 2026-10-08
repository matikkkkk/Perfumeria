// Babel solo lo usa la ruta de pruebas (Karma + webpack). Vite compila la app por su cuenta.
// - preset-env: convierte el JS moderno a algo que el navegador de pruebas entienda.
// - preset-react: transforma JSX (runtime automatico: no hace falta `import React` en cada archivo).
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { chrome: "100" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
