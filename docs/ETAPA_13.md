# Etapa 13 — Categorías, usuarios, historial y reportes

## Archivos
- `src/pages/admin/CategoriasAdmin.jsx`: listado, búsqueda y eliminación protegida de categorías con productos asociados.
- `src/pages/admin/NuevaCategoria.jsx` y `EditarCategoria.jsx`: formularios de alta y edición.
- `src/pages/admin/UsuariosAdmin.jsx`: listado, búsqueda y filtro por tipo.
- `src/pages/admin/NuevoUsuario.jsx` y `EditarUsuario.jsx`: alta y edición de cuentas.
- `src/pages/admin/DetalleUsuario.jsx`: información general y acceso al historial.
- `src/pages/admin/HistorialCompras.jsx`: órdenes asociadas al usuario y total de órdenes pagadas.
- `src/pages/admin/ReportesAdmin.jsx`: indicadores generales, ventas por producto e inventario; exportación CSV.


## Ejecutar
Desde la raíz del proyecto, inicia la API de desarrollo en una terminal (`npm run api`) y Vite en otra (`npm run dev`). En esta etapa no se agregan pruebas nuevas: corresponden a la etapa 14.

## Consideraciones
El esquema actual de productos guarda `categoria` como texto. Por ello, el conteo de productos compara el campo tanto con el identificador como con el nombre de la categoría. El historial relaciona las órdenes mediante `usuarioId` y el identificador/RUN del usuario. Las órdenes antiguas sin un `usuarioId` coincidente no se pueden asignar con seguridad a una cuenta.
