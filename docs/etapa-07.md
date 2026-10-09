# Etapa 7 - Carrito, Wishlist y cupones (hecha)

**Hecho**
- `pages/tienda/Carrito.jsx` reproduce carrito.html: filas con foto, precio c/u, botones − / +, subtotal y eliminar, más la tarjeta Resumen. Los items y el cupón siguen en `CarritoContext` (mismas claves de localStorage que el HTML: `carrito` y `cuponAplicado`).
- Componentes nuevos en `components/carrito/`: `ItemCarrito` (sin estado, avisa con callbacks) y `ResumenCarrito` (cupón, subtotal, descuento, total y "Finalizar compra").
- Cupones LUXURY10 (10 %) y BIENVENIDO15 (15 %), con los mismos mensajes del HTML. La tabla sigue en `utils/cupones.js`. Se agregó el botón "Quitar" junto al descuento (el HTML no tenía cómo sacar un cupón válido).
- El stock se valida con la copia guardada en cada item al agregarlo (sin volver a pedirlo a la API). Al pasarse: toast "No hay más stock disponible de <nombre>." Con el carrito vacío, "Finalizar compra" avisa por toast; con items lleva a `/checkout`.
- `pages/tienda/Wishlist.jsx` reproduce wishlist.html: el contexto guarda solo ids y la página pide los productos a la API (precio y stock al día). `ListaWishlist` filtra por los ids guardados, así el corazón de cada tarjeta la quita de la grilla al instante; sin favoritos muestra el aviso con enlace a Productos.
- Specs: `ResumenCarrito.spec.jsx`, tipo **estado** (texto del cupón, mensajes, descuento, total, quitar, finalizar) y `ListaWishlist.spec.jsx`, tipo **eventos** (clic en el corazón quita la tarjeta, lista vacía). Dos specs porque son dos views; si la pauta se cuenta por etapa, se puede dejar solo el de `ResumenCarrito`.

**Pendiente**
- Correr `npm run test:run` y `npm run build` en tu equipo (aquí no se pudieron ejecutar).
- Si un producto guardado en la wishlist se borra de la BD, el contador del navbar lo sigue contando (los ids no se limpian).
- Los precios con oferta entran al carrito en la etapa 8 (`agregarItem` ya acepta `{ ...producto, precio: precioConOferta }`).
- Siguiente: etapa 8, Categorías y Ofertas.
