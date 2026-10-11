# Corrección de pruebas de React (antes de etapa 15)

- Se ajustaron las 39 pruebas de humo de `src/test/views` que montan páginas usando `renderVista`.
- Ahora cada prueba espera las actualizaciones asíncronas de React mediante `await act(async () => { ... })`.
- Se conserva una prueba de humo por vista; no se eliminan los tests de componentes ni utilidades.
- Se reemplazó el mock condicional de `window.scrollTo` por `Object.defineProperty` para jsdom.
- Se conservó la actualización anterior de `src/pages/tienda/Login.spec.jsx`, alineada con la validación de correo vigente.
- Las rutas, servicios, datos simulados y la configuración de Vitest se mantienen.
- La instalación local de dependencias y la ejecución de la suite NO fueron posibles en este entorno (Node 22.16.0 es incompatible con jsdom 30.1.2, y faltan paquetes en la caché).
- Se requiere ejecutar en un PC con Node compatible: `npm ci`, `npm run test:run`, `npm run coverage` y `npm run build`.
- Si persisten avisos `act(...)`, compartir el log completo para revisar la operación asíncrona particular.
- Esta revisión no incluye la etapa 15 ni modifica el contrato del backend.
