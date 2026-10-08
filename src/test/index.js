// Punto de entrada unico de Karma: carga todas las pruebas (*.spec.js / *.spec.jsx) bajo src/.
// Para agregar una prueba basta con crear un archivo .spec en cualquier carpeta de src/.
// (package.json tiene "type": "module": en ESM webpack ofrece import.meta.webpackContext, no require.context.)
import "./setup";

const pruebas = import.meta.webpackContext("..", { recursive: true, regExp: /\.spec\.jsx?$/ });
pruebas.keys().forEach(pruebas);

// Con cobertura (npm run test:cov) tambien se cargan los archivos que ninguna prueba importa,
// para que el % cuente TODO el codigo de src/ y no solo lo que ya tiene prueba.
if (process.env.COVERAGE === "1") {
  const fuentes = import.meta.webpackContext("..", {
    recursive: true,
    regExp: /^\.\/(?!test\/|main\.jsx$)(?!.*\.spec\.jsx?$).*\.jsx?$/,
  });
  fuentes.keys().forEach(fuentes);
}
