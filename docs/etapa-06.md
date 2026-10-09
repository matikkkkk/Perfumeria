# Etapa 6 - Detalle de producto (hecha)

**Hecho**
- `pages/tienda/DetalleProducto.jsx` reproduce producto.html (`/productos/:id`): breadcrumb, hero, pirámide olfativa, historia, reseñas, llamado a comprar y maridaje, en el orden del HTML. Una sección = un componente en `components/detalle/`.
- Datos: `useProducto(id)` pide `GET /productos/:id` y separa "no existe" (404) de "API caída". Para eso `services/api.js` ahora agrega `status` al error.
- Tema: `useTemaProducto` aplica al `<body>` las clases `tema-*` y `nav-claro` y las variables `--tema-*` del producto, y las quita al salir (en el HTML cada página se recargaba; en SPA se quedarían pegadas).
- Hero con 3 variantes (imagen de fondo, `contain`, y respaldo con foto y texto). Se agregó un `h1` oculto en las dos primeras para accesibilidad.
- Reseñas: banco fijo en `data/resenas.js`; `utils/productoDetalle.js` elige siempre las mismas 3 por id (igual que el HTML).
- `ModalCompra` reemplaza el modal de Bootstrap: controlado por React, cierra con botón, Escape o clic en el fondo; cantidad hasta 10 o el stock. `useAgregarAlCarrito` ahora acepta cantidad.
- Pirámide: si una etapa no trae imagen, muestra título y notas en texto (el HTML dejaba la tarjeta vacía).
- Spec: `components/detalle/ModalCompra.spec.jsx`, tipo **propiedades** (abierto, producto, onCerrar, stock 0, tope de 10, añadir con cantidad).

**Pendiente**
- Correr `npm run test:run` y `npm run build` en tu equipo (aquí no se pudieron ejecutar).
- Revisar a ojo 3 productos de distinta estación (verano, otoño, invierno) por colores y navbar.
- Si se añade un producto a la wishlist desde el detalle, va en la etapa 7 (el HTML no tenía corazón aquí).
- Siguiente: etapa 7, Carrito, Wishlist y cupones.
