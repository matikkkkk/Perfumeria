# Perfumeria (Luxury) — Proyecto académico

Tienda online de perfumería desarrollada con HTML, CSS, Bootstrap y JavaScript, como práctica de trabajo colaborativo con historial de commits incremental.

## Cómo ejecutar
Abrir `index.html` con Live Server desde VS Code.

## Funcionalidades
- Catálogo de productos filtrable por género, estación, familia olfativa y estado de ánimo
- Ficha de producto con pirámide olfativa, maridaje por ocasión y sección "inspirado en"
- Diccionario olfativo (modal de búsqueda) y suscripción a newsletter
- Wishlist y carrito de compra con cupones de descuento (`LUXURY10`, `BIENVENIDO15`)
- Registro e inicio de sesión con validación de RUN chileno (dígito verificador) y correo institucional
- Panel administrativo (`/admin`) con gestión de productos, usuarios y visualización de órdenes, protegido por tipo de usuario (Administrador / Vendedor)
- Páginas informativas: Nosotros, Blogs, Contacto

## Administrador
Para probar el panel admin, cargar un usuario de prueba en la consola del navegador:
```js
localStorage.setItem("usuarioActual", JSON.stringify({correo:"admin@duoc.cl", tipo:"Administrador"}));
