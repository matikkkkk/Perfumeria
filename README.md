# Luxury Perfumería — React + Spring Boot + MySQL

Tienda de perfumería con panel administrativo, registro, carrito, pago simulado, órdenes y boleta. El frontend React consume **un único API Gateway** que distribuye solicitudes a tres microservicios Spring Boot. **El pago es simulado y la boleta no es un documento tributario del SII.**

| Servicio | Puerto | Base MySQL |
|---|---:|---|
| React (Vite) | 5173 | — |
| Gateway | 8080 | — |
| Catálogo | 8081 | `luxury_catalogo` |
| Usuarios | 8082 | `luxury_usuarios` |
| Órdenes | 8083 | `luxury_ordenes` |

## Requisitos

- Node.js compatible con Vite 8, npm, **JDK 21+**, Maven 3.9+ y **MySQL 8** instalado y ejecutándose.
- Cuenta MySQL con permisos para crear las tres bases, tablas y datos iniciales.
- En Windows, tener `mysql.exe` disponible (habitualmente en `C:\Program Files\MySQL\MySQL Server 8.0\bin`). MySQL Workbench no equivale al servidor MySQL.

## Arranque fácil (Windows / PowerShell)

1. Clona o descomprime el proyecto. Abre PowerShell en la raíz.
2. Asegúrate de que el servicio **MySQL80** (o su equivalente) esté iniciado.
3. Ejecuta `.\iniciar-perfumeria.ps1` (si tu política de PowerShell lo impide, ejecuta `powershell -ExecutionPolicy Bypass -File .\iniciar-perfumeria.ps1`).
4. Introduce el usuario y contraseña **de MySQL**, no las de la aplicación.
5. Espera a que se abran las terminales de Spring Boot y Vite; entra a <http://localhost:5173>.

El script crea solamente **las bases de datos que no existan**, instala dependencias npm si faltan, abre los cuatro procesos Java y Vite. No inicia ni instala el **servidor** MySQL. Evita usar dos instancias del lanzador a la vez. Para detener la tienda cierra las ventanas de cada servicio o pulsa `Ctrl+C` en cada una.

**Seguridad:** el script propaga `DB_PASS` a las terminales Java para desarrollo local. No envíes contraseñas al repositorio ni uses este lanzador para producción. En equipos compartidos, cierra las terminales al terminar y emplea usuarios MySQL con permisos limitados en lugar de `root` cuando sea posible.

## Inicialización de las bases y persistencia

Los servicios utilizan **Flyway**: en una base nueva, `V1__schema.sql` crea las tablas y `V2__datos_iniciales.sql` carga catálogo/órdenes. Usuarios de demostración se crean mediante `SemillaUsuarios` del servicio de usuarios cuando corresponde. Las migraciones **solo se ejecutan una vez**, registradas en `flyway_schema_history`, y no borran productos, usuarios ni órdenes al reiniciar.

Si una base **ya tiene tablas** creadas por los scripts SQL antiguos, Flyway aplica una **baseline** automáticamente (catálogo/órdenes versión 2 y usuarios versión 1) sin volver a insertar los datos. No elimina la orden #4 ni otras transacciones existentes. Haz un respaldo antes de la primera ejecución con cualquier versión nueva. Las migraciones posteriores deberán usar números superiores al baseline.

**IMPORTANTE:** `backend/database/*schema*.sql` y `*seed*.sql` son los scripts *históricos de inicialización manual*, y pueden contener `DROP TABLE` / `DELETE`. **No ejecutes esos archivos sobre bases que tengan datos reales.** Los archivos seguros de arranque son `backend/ms-*/src/main/resources/db/migration/V*.sql`.

Para ver si una compra sobrevive a un reinicio, ejecuta en MySQL Workbench antes y después:

```sql
SELECT id, estado, total FROM luxury_ordenes.ordenes WHERE id = 4;
SELECT orden_id, nombre, cantidad FROM luxury_ordenes.orden_items WHERE orden_id = 4;
```

Si en otro PC quieres llevarte **datos creados durante el uso**, debes exportar/importar MySQL; el seed solo recrea los registros iniciales.

## Arranque manual

Crea `.env` copiando `.env.example` (`VITE_API_URL=http://localhost:8080/api`). Configura las variables `DB_USER`, `DB_PASS` y opcionalmente `DB_URL` en **cada** terminal Java, luego ejecuta `mvn spring-boot:run` en `backend/ms-catalogo`, `backend/ms-usuarios`, `backend/ms-ordenes` y `backend/gateway` (sin credenciales MySQL en gateway). Por último, desde la raíz, `npm ci` y `npm run dev`. **Primero deben existir las tres bases vacías** (Flyway crea las tablas, pero no la base MySQL por sí solo).

Prueba el gateway con `Invoke-RestMethod http://localhost:8080/api/productos` en PowerShell. No ejecutes el mock `npm run api` al mismo tiempo: también usa el puerto 8080.

## Pruebas y compilación

```powershell
npm ci
npm run test:run
npm run coverage
npm run build
```

**39 tests de frontend**: exactamente una prueba por vista cubierta, en `src/test/views/` y algunos `src/pages/` con pruebas de comportamiento más útiles. Vitest + Testing Library, **no Karma**. Para Java, ejecuta `mvn test` en cada microservicio y gateway. Los tests de Java usan H2 en memoria, con Flyway deshabilitado para permitir `create-drop` en los tests.

## Documentación mantenida

- [`docs/CONTRATO_API.md`](docs/CONTRATO_API.md): contrato HTTP del backend real.
- [`backend/README.md`](backend/README.md): organización del backend, configuraciones y endpoints.

Las páginas HTML/CSS/JS originales, compilaciones antiguas (`dist/`, `coverage/`), dependencias (`node_modules/`) y copias de tests excluidos se retiraron del ZIP para evitar duplicación. `public/img/` conserva los recursos visuales activos del sitio. El mock API y `seed/` permanecen solo para regenerar las semillas o realizar pruebas de desarrollo.
