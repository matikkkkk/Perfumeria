# Etapa 8 - Categorías y Ofertas (hecha)

**Hecho**
- `pages/tienda/Categorias.jsx` (`/categorias`, Figura 4): una tarjeta por categoría arriba y, debajo, una sección por categoría con sus primeras 4 fragancias. Categorías de `GET /categorias`, productos de `GET /productos`; el cruce se hace con `producto.categoria`.
- `pages/tienda/CategoriaDetalle.jsx` (`/categorias/:id`): todos los productos de la categoría con el selector de orden del catálogo, enlace "Afinar con filtros" a `/productos?categoria=<id>` y estados de carga, error y "Categoría no encontrada".
- Componentes nuevos en `components/categorias/`: `TarjetaCategoria` (props `categoria` y `total`) y `SeccionCategoria`. Lógica en `utils/categorias.js`.
- `pages/tienda/Ofertas.jsx` (`/ofertas`): productos con una oferta vigente, con botones por etiqueta (Verano, Liquidación...), selector de orden y estados de carga, error y "sin ofertas vigentes".
- `utils/ofertas.js`: precio con descuento, vigencia (activa y fecha de término de hoy en adelante), cruce oferta-producto (si un producto tiene dos ofertas, gana la de mayor descuento), etiquetas, filtro y orden ("Destacados" = mayor descuento primero).
- `TarjetaProducto` acepta la prop opcional `oferta`: muestra "-15% · Verano", el precio original tachado, el precio nuevo y "Hasta el dd/mm/aaaa". "Añadir" mete el producto al carrito con el precio de oferta. Sin la prop, la tarjeta queda igual que antes (home, productos, categorías, wishlist).
- `components/ofertas/EtiquetasOferta.jsx`: botones de etiqueta, sin estado propio (la página guarda la elegida).
- CSS al final de `style.css`: `.categoria-card__img`, `.badge-oferta`, `.price-original`.
- Specs: `TarjetaCategoria.spec.jsx` (tipo **props**, 5 tests) y `EtiquetasOferta.spec.jsx` (tipo **eventos**, 5 tests). Además `utils/ofertas.spec.js` (lógica pura, 14 tests).

**Pendiente**
- Correr `npm run test:run` y `npm run build` en tu equipo (aquí no pude ejecutarlos: el node_modules es de Windows y no hay red para instalar el binding de Linux).
- El detalle de producto (`/productos/:id`) todavía no conoce las ofertas: ahí se compra al precio normal.
- Si el mismo producto se agrega al carrito a precio normal y luego desde Ofertas (o al revés), el carrito conserva el precio del primero (`agregarItem` no actualiza el precio de un item que ya existe).
- La categoría "ligeros" no tiene productos en el seed; su sección muestra "Próximamente".
- Siguiente: etapa 9, Checkout, Pago correcto, Pago con error, boleta y guardado de la orden.
