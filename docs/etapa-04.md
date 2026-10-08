# Etapa 4 — Jasmine y Karma (hecha)

**Hecho**
- Karma + Jasmine con webpack y Babel. Archivos nuevos: `karma.conf.cjs`, `babel.config.cjs`, `src/test/` (`index.js`, `setup.js`, `utils.jsx`, `humo.spec.jsx`).
- Scripts: `npm test` (Chrome sin ventana, una pasada), `npm run test:watch`, `npm run test:cov` (reporte en `coverage/`), `npm run test:jsdom` (sin Chrome instalado).
- Cualquier archivo `*.spec.js` o `*.spec.jsx` dentro de `src/` se ejecuta solo. No hay que registrarlo.
- Prueba de humo (6 casos): Jasmine, JSX con Babel, imports sin extensión, `import.meta.env` (definido con `DefinePlugin`) y contextos + router montando.
- Specs con DOM que quedaron pendientes de la etapa 3: `RutaProtegida` (5), `Navbar` (7) y `NewsletterForm` (4). Las 24 specs de las etapas 2 y 3 ahora corren en Karma. Total: 54.
- `src/test/utils.jsx`: `renderConApp(ui, { ruta, usuario })` monta el componente con router y los tres contextos; `USUARIOS_PRUEBA` trae un admin, un vendedor y un cliente.
- Con `test:cov` el % cuenta todo `src/` (no solo lo que ya tiene prueba): hoy ~55 % de líneas.

**Pendiente / a decidir**
- `npm test` y `test:watch` necesitan Chrome. Si solo tienes Edge, define `CHROME_BIN` o usa `npm run test:jsdom`.
- Las specs son aleatorias (`random: true`): si una falla solo a veces, depende del orden.
- Desde la etapa 5: cada pantalla termina con 1–2 specs usando `renderConApp`.
