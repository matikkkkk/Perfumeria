# Etapa 2 — utils/ y contextos (hecha)

**Hecho**
- `src/utils/validaciones.js`: `validarRun`, `validarCorreo`, `limpiarRun`, `reglasCampos` y `validarFormulario` (puras, sin DOM).
- `src/utils/cupones.js`: `CUPONES` en porcentaje entero (LUXURY10 = 10). `seed/ordenes.js` ahora importa de aquí; `db.json` regenerada, idéntica.
- `src/utils/etiquetas.js`: `OCASIONES`, `HUMOR`, `FAMILIA` (+ `TIPO`, `CONCENTRACION` y helpers `etiquetaX`).
- `src/utils/carrito.js` y `wishlist.js`: lógica pura (stock, cantidades, `aItemsOrden`); `formato.js`: `formatearPrecio`; `storage.js`.
- `src/hooks/useStorage.js`: useState persistido en localStorage (tolera JSON corrupto).
- `src/context/`: `AuthContext` (usa `usuariosService.login`), `CarritoContext` (items + cupón + totales), `WishlistContext`, `AppProviders` (envuelve `<App/>` en `main.jsx`).
- Claves de localStorage iguales al HTML: `usuarioActual`, `carrito`, `cuponAplicado`, `wishlist`.
- 3 specs Jasmine en `src/utils/*.spec.js` (24 casos). Verificadas con un runner provisorio; Karma las ejecuta en la etapa 4.

**Contrato que usarán las pantallas**
- `useCarrito().agregar(producto, cantidad)` devuelve `{ ok, motivo, critico, stockRestante }`: la pantalla decide alert/toast.
- `useAuth().iniciarSesion()` lanza `ErrorAuth` con `.campo` (`correo` | `password`). `tieneRol(...)` para `RutaProtegida`.
- Con oferta: `agregar({ ...producto, precio: precioConOferta }, n)`.

**Pendiente / a decidir**
- RUN de seed `19011022K` (admin) y `15234567K` (vendedor) no pasan módulo 11 (correctos: `190110222`, `152345674`). El HTML original ya tenía ese error. Solo afecta al editar esos usuarios en el admin (etapa 13).
- Wishlist y carrito son por navegador, no por usuario. Si se quiere por usuario, se cambia en la etapa 7.
