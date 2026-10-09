# Etapa 10 — Login, Registro, Contacto, Nosotros y Blogs

## Hecho
1. Se reemplazó la página pendiente de Login por un formulario controlado con React.
2. Login usa `AuthContext.iniciarSesion` y el servicio existente `usuariosService`.
3. Se mantienen los mensajes de error de credenciales y el estado de carga del formulario.
4. Tras iniciar sesión, clientes vuelven a la tienda y Administrador/Vendedor entran al panel.
5. Registro valida campos requeridos, longitud mínima de contraseña y coincidencia de contraseñas.
6. Registro revisa correo duplicado y crea usuarios con tipo `Cliente` mediante `POST /usuarios`.
7. Contacto incluye formulario validado y guarda mensajes en `POST /mensajes`.
8. Nosotros incluye presentación de marca, propuesta de valor y enlaces al catálogo.
9. Blogs muestra tres artículos editoriales con categorías y tiempos de lectura.
10. DetalleBlog resuelve los tres artículos por `/blogs/1`, `/blogs/2` y `/blogs/3`.
11. Se agregó `Login.spec.jsx` con Vitest y Testing Library para validar el evento de error en el login.
12. Se conservó React Router, Bootstrap y los servicios REST existentes.

## Pendiente
- Ejecutar `npm run test:run` y `npm run build` en un entorno con dependencias instaladas correctamente.
- Probar el registro y el envío de contacto con JSON Server encendido.
- Revisar visualmente en navegador y comparar con las páginas HTML originales.
- Crear commit en el repositorio local del estudiante.

## Prueba
- `src/pages/tienda/Login.spec.jsx`: prueba de eventos (fallo de autenticación y alerta visible).
