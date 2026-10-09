# Etapa 5B - Productos con filtros, orden y búsqueda (hecha)

**Hecho**
- `pages/tienda/Productos.jsx` reproduce productos.html: encabezado, panel de filtros, contador, orden y grilla de 3 por fila con `TarjetaProducto`.
- Estado en la página: selección de filtros y orden (`useState`). Género y búsqueda salen de la URL (`?genero=`, `?buscar=`): el buscador del Navbar ya navegaba a `/productos?buscar=...`, así que no hizo falta contexto ni tocar el Navbar.
- Filtros por categoría, ocasión, estado de ánimo y familia (los de la pauta) más estación, tipo, concentración y ML del HTML. Dentro de un grupo se cumple una opción (O); entre grupos, todos (Y). Preselección por URL: `/productos?categoria=intensos`.
- Las opciones se calculan con los productos que existen (el HTML tenía ML fijos, ej. 30 y 105, que ya no están en el seed).
- Búsqueda sin distinguir mayúsculas ni tildes, sobre nombre + marca. "Limpiar filtros" deja solo `?genero=` en la URL, como el HTML.
- Componentes nuevos: `PanelFiltros` (abre/cierra en móvil, sin `data-bs-toggle`) y `BarraResultados`. Lógica pura en `utils/filtrosProductos.js`. Se agregó `ESTACION` a `utils/etiquetas.js`.
- Spec: `components/productos/PanelFiltros.spec.jsx`, tipo **eventos** (+ un caso de estado): clic en opciones, limpiar, panel móvil, sección sin opciones.

**Pendiente**
- Correr `npm run test:run` y `npm run build` en tu equipo (aquí no pude ejecutarlos).
- Las categorías vienen de `/categorias`; con la API apagada se muestra el id capitalizado.
- Siguiente: etapa 6, detalle de producto (`/productos/:id`).
