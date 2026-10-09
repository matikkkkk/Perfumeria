# Etapa 4 - Vitest (hecha)

**Hecho**
- Pruebas con Vitest + Testing Library + jsdom. Reemplaza a Karma + Jasmine + webpack + Babel (Karma esta deprecado y Vitest comparte la sintaxis de Jasmine y se integra con Vite).
- Config en `vite.config.js` (bloque `test`: jsdom, globals, setupFiles, cobertura v8) y `src/setupTests.js` (jest-dom y limpieza de localStorage antes de cada prueba).
- Scripts: `npm test` (modo observador), `npm run test:run` (una pasada), `npm run coverage` (reporte en `coverage/`).
- Cualquier archivo `*.spec.js(x)` o `*.test.js(x)` dentro de `src/` se ejecuta solo.
- Migracion de sintaxis: `toBeTrue()`/`toBeFalse()` a `toBe(true)`/`toBe(false)`, `jasmine.createSpy` a `vi.fn()`, `jasmine.any` a `expect.any`.
- Se eliminaron `karma.conf.cjs`, `babel.config.cjs`, `src/test/index.js` y `src/test/setup.js`.
- `src/test/utils.jsx`: `renderConApp(ui, { ruta, usuario })` sigue igual (router + los tres contextos).
- 9 archivos, 54 pruebas pasando.

**Pendiente / a decidir**
- Confirmar con el docente que se puede entregar con Vitest (la pauta menciona Jasmine/Karma) y guardar la respuesta.
- Documentar la "Decision de herramienta" en el documento de cobertura (etapa 18).
- Desde la etapa 5: cada pantalla termina con 1 spec usando `renderConApp`.
