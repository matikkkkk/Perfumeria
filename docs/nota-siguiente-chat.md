1. El proyecto base es `Perfumeria React`, con Vite, React Router y Bootstrap.
2. Vitest está configurado con jsdom, globals y `src/setupTests.js`; no migrar a Karma.
3. Etapa 13: se completaron Categorías, Usuarios, detalle/edición/creación de usuarios, historial de compras y Reportes generales.
4. Categorías permite buscar, crear, editar y eliminar, evitando eliminar categorías asociadas a productos.
5. Usuarios permite búsqueda, filtro por tipo, detalle, edición, creación y acceso al historial.
6. Historial consulta órdenes por `usuarioId` en orden descendente de fecha.
7. Reportes generales calcula ingresos solo de órdenes `Pagado`, órdenes por estado, productos vendidos e inventario.
8. Se agregaron specs para Categorías, Usuarios, HistorialCompras y ReportesAdmin.
9. Los tests simulan los servicios con `vi.mock`, así que no requieren json-server para las pruebas de UI.
10. Se agregó `docs/etapa-13-14.md` con el resumen y los pendientes.
11. Se agregó `docs/contrato-api-frontend.md` con los endpoints que actualmente espera el frontend.
12. La API incluida sigue siendo json-server en `mock-api`; el ZIP no incluye los tres microservicios reales.
13. Falta ejecutar `npm run test:run`, `npm run coverage` y `npm run build` con dependencias instaladas; npm install no terminó en el entorno de trabajo.
14. Para etapas 15-17 hace falta el código/configuración del backend real o la especificación técnica de los microservicios y base de datos.
