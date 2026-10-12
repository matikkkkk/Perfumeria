# Etapa 17 · Microservicio 3 (ms-ordenes), gateway, CORS y conexión del front

1. `backend/ms-ordenes` (Spring Boot 3, Java 21, puerto 8083, BD `luxury_ordenes`): mismas capas que los otros servicios. Tablas `ordenes`, `orden_items` y `mensajes` (`04-schema-ordenes.sql`); `05-seed-ordenes.sql` se genera con `npm run db:seed-ordenes`.
2. `/api/ordenes`: CRUD, `?usuarioId=`, `?estado=`, `?_sort=fecha&_order=desc`; PATCH solo de `estado` (a `Pagado` recalcula el total). `/api/mensajes` para el formulario de Contacto. Detalle en `contrato-api-v2.md`.
3. El servidor valida y recalcula los importes (subtotal, descuento, total, tarjeta de 4 dígitos); un `Pago fallido` puede quedar con total 0, como lo manda el checkout.
4. `backend/gateway` (Spring Cloud Gateway, puerto 8080): reenvía `/api/*` a los tres servicios sin reescribir rutas.
5. CORS solo en el gateway: lista blanca `localhost:5173`, `127.0.0.1:5173`, `localhost:4173`; variable `CORS_ORIGINS` para otros.
6. Front: `api.js` guarda `status`, `cuerpo` del error y `status 0` sin conexión; `usuariosService.login` usa `POST /auth/login` y mantiene `ErrorAuth` (`Login.jsx` sin cambios). `.env.example` apunta al gateway.
7. Pruebas nuevas: `OrdenesApiTest` (24), `CorsTest` en el gateway (3), `api.spec.js` y `usuariosService.spec.js` en el front.
8. **No se pudo ejecutar** `mvn test`, `npm run test:run` ni `npm run build` en el entorno donde se generó esta etapa (sin Maven ni acceso a internet): hay que correrlos en tu máquina antes del commit.
9. Pendiente (etapa 18): ERS v2, documento de cobertura, GitHub público, zip final y guion de 15 minutos.
10. Limitaciones documentadas: sin JWT (las rutas admin se protegen solo en el front) y las referencias `usuarioId` / `productoId` no se verifican entre servicios.
