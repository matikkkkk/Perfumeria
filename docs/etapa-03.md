# Etapa 3 — Router y layout (hecha)

**Hecho**
- `src/routes/AppRoutes.jsx`: todas las rutas de la Figura 2 (tienda + admin). `BrowserRouter` está en `main.jsx`; `App.jsx` quedó delgado (se quitó la pantalla de prueba de la etapa 1).
- `src/routes/RutaProtegida.jsx`: sin sesión -> `/login` (guarda `state.desde`); con sesión pero sin rol -> `/acceso-denegado`. Sirve como layout (`<Outlet/>`) o envolviendo hijos.
- `src/utils/acceso.js`: `ROLES_STAFF`, `ROLES_SOLO_ADMIN` y `evaluarAcceso()` (lógica pura). `AuthContext.ROLES_ADMIN` ahora apunta a `ROLES_STAFF`.
- `src/routes/menuAdmin.js`: menú lateral filtrado por rol (`menuParaUsuario`).
- Layouts: `LayoutTienda` (Navbar + Footer + ScrollToTop) y `LayoutAdmin` (versión mínima: cabecera + menú lateral; la etapa 11 la completa).
- `Navbar`: buscador, contadores de carrito y wishlist, menú de usuario (cierra sesión por `/logout`). Desplegables con el hook `hooks/useDropdown.js` (clic fuera, Escape y cierre al navegar); sin `data-bs-toggle`.
- `Footer` + `NewsletterForm` (valida con `validarCorreo`, mismos textos del HTML).
- 36 páginas vacías (`PaginaPendiente`, muestra ruta y parámetros) + `AccesoDenegado`, `NoEncontrada` y `CerrarSesion` (`/logout`).
- `main.jsx` ahora importa `style.css` y `bootstrap-icons`; `index.html` carga las fuentes y pone `luxury-bg text-light` en `<body>`.
- Specs: `utils/acceso.spec.js` (5 casos) y `routes/menuAdmin.spec.js` (3 casos).

**Reglas de acceso**
- Tienda pública, incluido `/checkout` (el invitado compra; con sesión se autocompletan sus datos).
- `/admin/*`: Administrador y Vendedor.
- Solo Administrador: categorías, usuarios y crear/editar productos (en el HTML el Vendedor tampoco veía Nuevo producto ni Usuarios).

| Zona | Rutas | Etapa |
|---|---|---|
| Tienda | `/`, `/productos` | 5 |
| | `/productos/:id` | 6 |
| | `/carrito`, `/wishlist` | 7 |
| | `/categorias`, `/categorias/:id`, `/ofertas` | 8 |
| | `/checkout`, `/pago-correcto/:ordenId`, `/pago-error/:ordenId` | 9 |
| | `/login`, `/registro`, `/contacto`, `/nosotros`, `/blogs`, `/blogs/:id` | 10 |
| Admin | `/admin`, `/admin/ordenes`, `/admin/ordenes/:id`, `/admin/perfil` | 11 |
| | `/admin/productos`, `/nuevo`, `/criticos`, `/reportes`, `/:id`, `/:id/editar` | 12 |
| | `/admin/categorias` (+ `/nueva`, `/:id/editar`), `/admin/usuarios` (+ `/nuevo`, `/:id`, `/:id/editar`, `/:id/compras`), `/admin/reportes` | 13 |

**Pendiente / a decidir**
- Correr `npm install` (se agregó `bootstrap-icons` a `package.json`; el lock se actualiza solo).
- El Login (etapa 10) debe leer `location.state?.desde` para devolver al usuario a donde iba.
- El HTML tiene Diccionario olfativo (modal) y newsletter que no están en el plan: el newsletter ya está en el footer; el Diccionario falta (sugerido: etapa 5, junto al Home).
- Specs con DOM de `RutaProtegida`, `Navbar` y `NewsletterForm`: se escriben en la etapa 4 cuando exista Karma.
- El Figura 10 rotula "Editar usuario" bajo Categoría; se interpretó como "Editar categoría".
