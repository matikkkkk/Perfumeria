# Etapas 13 y 14 — Administración y pruebas

## Etapa 13
- La vista de categorías consulta categorías y productos desde los servicios REST.
- Se muestra el número de productos asociados y se evita borrar categorías que todavía tienen productos.
- Se completaron los formularios para crear y editar categorías.
- La vista de usuarios permite buscar por RUN, nombre, correo, región y comuna, y filtrar por tipo.
- El listado muestra el número de órdenes asociadas a cada usuario.
- Se completaron las vistas de detalle, edición y creación de usuarios.
- El historial obtiene las órdenes por `usuarioId`, ordenadas por fecha descendente.
- Los reportes generales muestran órdenes por estado, ingresos de órdenes pagadas y productos vendidos.
- Se mantiene el formato de precios en pesos chilenos y los estilos administrativos actuales.

## Etapa 14
- Se agregó una prueba de vista para Categorías, Usuarios, Historial de compras y Reportes generales.
- Las pruebas usan Vitest, React Testing Library y `vi.mock`; no usan Jasmine ni Karma.
- Los servicios se simulan en las pruebas para no depender de una API encendida.
- Antes de cerrar la etapa, ejecutar `npm run test:run`, `npm run coverage` y `npm run build` en un entorno con dependencias instaladas.
- La cobertura debe revisarse en `coverage/index.html`; este documento no afirma un porcentaje que todavía no se haya medido.

## Pendiente para etapas 15 a 17
El ZIP recibido contiene el frontend React y la API simulada de json-server, pero no contiene el código fuente ni la configuración de los tres microservicios reales. Para implementar y verificar la conexión con la base de datos sin inventar contratos, se necesita el backend actual o las instrucciones técnicas que indiquen tecnología, puertos, entidades, credenciales de desarrollo y responsabilidades de cada microservicio.
