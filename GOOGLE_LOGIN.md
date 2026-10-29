# Inicio de sesión con Google

## Configuración

- Google Cloud → Cliente OAuth de tipo **Aplicación web**.
- Origen JavaScript autorizado: `http://localhost:5173`.
- URI de redireccionamiento: vacío (Google Identity Services, callback JavaScript).
- Frontend `.env`: `VITE_GOOGLE_CLIENT_ID=192171585366-1r6jcddvtt445osv8h2ef6lqvde36b41.apps.googleusercontent.com`.
- Backend `ms-usuarios`: variable `GOOGLE_CLIENT_ID` con **ese mismo ID** (hay valor predeterminado en `application.properties`).
- **No se requiere el secreto del cliente** para este flujo de verificación de ID tokens; no lo coloques en el ZIP.

## Flujo

`Login.jsx` → Google Identity Services → `POST /api/auth/google` a través del gateway → `ms-usuarios` valida firma, emisor, audiencia y expiración → busca por `google_sub` → devuelve usuario `Cliente` existente o crea uno nuevo. El login con contraseña original no cambia.

Flyway ejecutará `V2__google_login.sql` al arrancar `ms-usuarios`; añade `google_sub` sin borrar usuarios. Para instalación manual de cero, aplicar la migración después del SQL de usuarios.

**RUN:** como la base actual exige un RUN de 9 caracteres para toda cuenta, los nuevos usuarios Google reciben un identificador interno que comienza con `G`. No es un RUN válido. Antes de procesos que requieran RUT real (boletas/compra/despacho) hay que ampliar el perfil y el flujo de validación de identidad; no usar este identificador como RUT real.

**Cuentas existentes:** una cuenta local con el mismo correo **no se vincula automáticamente**, para evitar asociar por accidente roles de administrador o vendedor. Usar contraseña tradicional.

Para levantar todo, usa `iniciar-perfumeria.ps1` y luego abre `http://localhost:5173/login`. Si Google muestra `origin_mismatch`, revisa el puerto y el origen autorizado en Cloud Console.
