# Etapa 15 · Backend, microservicio 1 y contrato de la API

1. Decisión: **Spring Boot 3 + MySQL 8**, una BD por microservicio (justificado en `docs/contrato-api-v2.md`).
2. `backend/database/01-schema-catalogo.sql`: tablas `categorias`, `productos` (campos anidados en columnas JSON) y `ofertas` (FK con ON DELETE CASCADE).
3. `backend/database/generar-seed-catalogo.mjs` → `02-seed-catalogo.sql` con los mismos 3 categorías / 42 productos / 6 ofertas de `seed/*.js`; verifiqué que no hay categorías ni productos huérfanos.
4. `backend/ms-catalogo` (puerto 8081): capas controller/service/repository/model, errores unificados, ids como texto, filtros `?categoria=` y `_expand=producto`, PATCH parcial, 409 para duplicados y categorías en uso.
5. 13 tests de integración (MockMvc + H2) en `CatalogoApiTest`.
6. `docs/contrato-api-v2.md` y `backend/README.md` (arranque, variables de entorno, pruebas).
7. **Pendiente / no verificado:** aquí no hay Maven ni internet, así que el servicio no se compiló ni se ejecutaron `mvn test` ni el SQL en MySQL real. Solo se comprobó que el Java no tiene errores de sintaxis. Ejecutar `mvn test` primero en tu equipo.
8. No incluye CORS ni gateway (etapa 17). El front sigue usando json-server hasta entonces.
9. Siguiente: etapa 16 → `ms-usuarios` (CRUD + login con BCrypt, puerto 8082).
