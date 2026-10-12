# Backend · Luxury Perfumería

Arquitectura: **React → (gateway :8080, etapa 17) → 3 microservicios Spring Boot → MySQL** (una base de datos por servicio).

| Servicio | Puerto | Base de datos | Responsabilidad | Etapa |
|---|---|---|---|---|
| `ms-catalogo` | 8081 | `luxury_catalogo` | productos, categorías, ofertas | **15 (listo)** |
| `ms-usuarios` | 8082 | `luxury_usuarios` | usuarios, login (BCrypt) | 16 |
| `ms-ordenes` | 8083 | `luxury_ordenes` | órdenes/boletas, mensajes de contacto | 17 |
| gateway | 8080 | — | punto único para el front + CORS | 17 |

## Requisitos
- JDK 21, Maven 3.9+ (o IntelliJ / VS Code con Extension Pack for Java)
- MySQL 8 (XAMPP, MySQL Workbench o Docker)

## Puesta en marcha de ms-catalogo
```bash
# 1) Base de datos (desde la raíz del proyecto)
mysql -u root -p < backend/database/01-schema-catalogo.sql
mysql -u root -p < backend/database/02-seed-catalogo.sql

# 2) Servicio
cd backend/ms-catalogo
mvn spring-boot:run          # DB_USER / DB_PASS / DB_URL por variable de entorno si no es root sin clave

# 3) Comprobar
curl http://localhost:8081/api/catalogo/salud
curl http://localhost:8081/api/productos?categoria=intensos
curl "http://localhost:8081/api/ofertas?activa=true&_expand=producto"
```
Ejemplo con clave: `DB_PASS=miClave mvn spring-boot:run` (Windows PowerShell: `$env:DB_PASS="miClave"; mvn spring-boot:run`).

## Pruebas
```bash
cd backend/ms-catalogo && mvn test      # usa H2 en memoria, no necesita MySQL
```

## Regenerar el SQL de datos
Los datos salen de los mismos `seed/*.js` que usa json-server:
```bash
node backend/database/generar-seed-catalogo.mjs
```

## Capas (patrón que seguirán los 3 servicios)
`controller` (HTTP) → `service` (reglas de negocio) → `repository` (Spring Data JPA) → `model` (entidades).
Errores unificados en `exception/ManejadorErrores` con cuerpo `{status, error, mensaje}`.
