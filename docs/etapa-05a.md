# Etapa 5A - Home (hecha)

**Hecho**
- `pages/tienda/Home.jsx` reproduce index.html: hero, Nuevos Lanzamientos (carrusel, avanza solo cada 6 s), manifiesto, colecciones Mujer/Hombre/Unisex (4 tarjetas por slide), La Maison Monthly, Los más buscados y Preguntas Frecuentes.
- Diccionario Olfativo como sección reutilizable (`DiccionarioOlfativo`, ancla `#diccionario`) con buscador; el botón del hero baja hasta ella. Ya no es modal.
- Cada sección es un componente en `components/home/`. Reutilizables en 5B, 8 y 9: `TarjetaProducto`, `ChipHumor`, `InspiradoEn` (en `components/producto/`).
- Hooks nuevos: `useCarrusel` (reemplaza data-bs-slide) y `useAgregarAlCarrito` (agrega y avisa con toast, mismos textos del HTML). `ToastContext` reemplaza mostrarToast y se suma a `AppProviders`.
- Contenido fijo en `data/` (diccionario, planes, faq); lógica pura en `utils/carrusel.js` y `utils/diccionario.js`.
- Spec: `components/home/Destacados.spec.jsx`, tipo **renderizado** (lista completa, lista vacía, precio/enlace, renderizado condicional de "Últimas unidades").

**Pendiente**
- El HTML tenía un link "Diccionario" en el navbar (abría el modal): no se agregó para no tocar `Navbar.spec`; agregar `/#diccionario` si se quiere.
- Los productos "mujer/hombre/unisex" salen de `/productos` de la API: encender `npm run api` para ver el home con datos.
- Siguiente: 5B (Productos con filtros, orden y búsqueda) reutilizando `TarjetaProducto` con `columna="col-12 col-md-6 col-lg-4"`.
