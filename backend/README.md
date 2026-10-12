# Backend · Luxury Perfumería

Arquitectura: **React → gateway :8080 → 3 microservicios Spring Boot → MySQL** (una base de datos por servicio).

| Servicio | Puerto | Base de datos | Responsabilidad | Etapa |
|---|---|---|---|---|
| `ms-catalogo` | 8081 | `luxury_catalogo` | productos, categorías, ofertas | **15 (listo)** |
| `ms-usuarios` | 8082 | `luxury_usuarios` | usuarios, login (BCrypt) | **16 (listo)** |
| `ms-ordenes` | 8083 | `luxury_ordenes` | órdenes/boletas, mensajes de contacto | **17 (listo)** |
| `gateway` | 8080 | — | punto único para el front + CORS | **17 (listo)** |

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

## Puesta en marcha de ms-usuarios
```powershell
# 1) Base de datos (solo la estructura; los 3 usuarios demo los crea el servicio con BCrypt)
mysql -u root -p < backend/database/03-schema-usuarios.sql   # o ejecutar el archivo en MySQL Workbench

# 2) Servicio
cd backend/ms-usuarios
$env:DB_PASS="tu_clave"      # si tu MySQL tiene clave
mvn spring-boot:run

# 3) Comprobar
curl http://localhost:8082/api/auth/salud
curl http://localhost:8082/api/usuarios
curl -X POST http://localhost:8082/api/auth/login -H "Content-Type: application/json" -d '{"correo":"admin@duoc.cl","password":"admin123"}'
```
(En PowerShell, si `curl` da problemas, usar `curl.exe` o probar el login desde el front en la etapa 17.)

## Puesta en marcha de ms-ordenes
```powershell
# 1) Base de datos (estructura + 3 órdenes demo, opcional)
mysql -u root -p < backend/database/04-schema-ordenes.sql
mysql -u root -p < backend/database/05-seed-ordenes.sql     # se regenera con: npm run db:seed-ordenes

# 2) Servicio
cd backend/ms-ordenes
$env:DB_PASS="tu_clave"      # si tu MySQL tiene clave
mvn spring-boot:run

# 3) Comprobar
curl http://localhost:8083/api/ordenes/salud
curl "http://localhost:8083/api/ordenes?_sort=fecha&_order=desc"
```

## Puesta en marcha del gateway (y de todo el sistema)
Orden recomendado: MySQL → ms-catalogo → ms-usuarios → ms-ordenes → gateway → front. Cada servicio en su propia terminal.
```powershell
cd backend/gateway
mvn spring-boot:run          # puerto 8080

# Comprobar que el gateway reenvía a los tres servicios
curl http://localhost:8080/api/catalogo/salud
curl http://localhost:8080/api/auth/salud
curl http://localhost:8080/api/ordenes/salud

# Front (en la raíz del proyecto; .env con VITE_API_URL=http://localhost:8080/api)
npm run dev                  # http://localhost:5173
```
Variables del gateway: `CORS_ORIGINS` (orígenes permitidos, separados por coma), `MS_CATALOGO_URL`, `MS_USUARIOS_URL`, `MS_ORDENES_URL`, `PORT`.
No ejecutar `npm run api` (json-server) a la vez: también usa el puerto 8080.

**Si el navegador muestra un error de CORS:** (1) ¿el front corre en uno de los orígenes de `CORS_ORIGINS`? (por defecto `localhost:5173`); (2) ¿el gateway está encendido? Un gateway apagado también aparece como "CORS error" en la consola; (3) ¿`VITE_API_URL` apunta al gateway (8080) y no a un microservicio?

## Pruebas
```bash
cd backend/ms-catalogo && mvn test      # usa H2 en memoria, no necesita MySQL
cd backend/ms-usuarios && mvn test
cd backend/ms-ordenes && mvn test      # 24 pruebas (MockMvc + H2)
cd backend/gateway && mvn test         # pruebas de CORS (no necesita los microservicios)
```

## Regenerar el SQL de datos
Los datos salen de los mismos `seed/*.js` que usa json-server:
```bash
node backend/database/generar-seed-catalogo.mjs
```

## Capas (patrón de los 3 servicios)
`controller` (HTTP) → `service` (reglas de negocio) → `repository` (Spring Data JPA) → `model` (entidades).
Errores unificados en `exception/ManejadorErrores` con cuerpo `{status, error, mensaje}`.
