# Etapa 16 · Microservicio 2: ms-usuarios

1. `backend/ms-usuarios` (Spring Boot 3, Java 21, puerto 8082, BD `luxury_usuarios`): mismas capas que ms-catalogo.
2. `backend/database/03-schema-usuarios.sql`: tabla `usuarios` (RUN como PK, correo único, `password_hash`, CHECK del tipo).
3. Contraseñas con **BCrypt** (solo `spring-security-crypto`, sin Spring Security completo). Nunca salen en una respuesta (`@JsonIgnore`).
4. CRUD `/api/usuarios` (filtros `?correo=`, `?run=`, `?tipo=` que usa el registro), PUT sin password conserva la clave, PATCH para el perfil, DELETE protege al único administrador.
5. `POST /api/auth/login`: 200 con el usuario sin clave; 401 con `campo` = `correo` | `password` (mantiene `ErrorAuth` del front).
6. Validaciones iguales a las del front: RUN módulo 11, dominios de correo permitidos, contraseña 4-10, largos máximos.
7. Usuarios demo creados por `SemillaUsuarios` en el primer arranque (si la tabla está vacía).
8. **Corrección de datos:** en `seed/usuarios.js` el admin (`19011022K`) y el vendedor (`15234567K`) tenían RUN con dígito verificador inválido; ahora son `190110222` y `152345674`. `mock-api/db.json` regenerado.
9. 20 pruebas de integración en `UsuariosApiTest` (MockMvc + H2). Correr `mvn test` en `backend/ms-usuarios`.
10. Pendiente: el front aún usa json-server; el cambio de `login` y de `api.js` (leer el cuerpo del 401) va en la etapa 17.
11. Sin JWT (decisión documentada en `contrato-api-v2.md`).
12. Siguiente: etapa 17 → `ms-ordenes` (puerto 8083), gateway (8080), CORS y conexión del front.
