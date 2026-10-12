# Contrato de la API v2 (backend real, etapa 15)

Reemplaza a `contrato-api-frontend.md` (que describía json-server). El front sigue llamando a **una sola URL**:
`VITE_API_URL=http://localhost:8080/api` (el gateway, etapa 17). Mientras no exista el gateway, `ms-catalogo` se prueba directo en `http://localhost:8081/api`.

## Decisiones
- **MySQL 8**, una BD por microservicio (`luxury_catalogo`, `luxury_usuarios`, `luxury_ordenes`). No hay claves foráneas entre BD distintas: `ordenes.usuarioId` y `items[].productoId` son referencias lógicas; la orden guarda una copia de los datos del producto.
- **Spring Boot 3 (Java 21) + JPA/Hibernate + Bean Validation.**
- Todas las rutas empiezan con `/api` dentro de cada servicio, así el gateway solo reenvía sin reescribir.
- **ids como texto** en el JSON (`"id": "7"`), igual que el mock, para no tocar el front.
- Los campos `null` no se envían (forma idéntica a json-server).
- Errores: `{ "status": 409, "error": "Conflict", "mensaje": "..." }`. El front solo lee `status`.

## Códigos de estado
| Código | Cuándo |
|---|---|
| 200 / 201 / 204 | OK / creado (con `Location`) / borrado sin cuerpo |
| 400 | validación (precio negativo, campo obligatorio, categoría u producto inexistente, JSON mal formado) |
| 404 | el recurso no existe |
| 409 | duplicado (código de producto, id de categoría) o regla de negocio (categoría con productos) |

## ms-catalogo (implementado) · puerto 8081

### Productos `/api/productos`
| Método | Ruta | Detalle |
|---|---|---|
| GET | `/api/productos` | Filtros por igualdad (sin distinguir mayúsculas): `categoria, genero, familia, estacion, tipo, marca, concentracion, codigo`. Búsqueda `q` en nombre/marca. Orden por id. |
| GET | `/api/productos/{id}` | 404 si no existe |
| POST | `/api/productos` | Obligatorios: `codigo` (único), `marca`, `nombre`, `precio ≥ 0`. `stock ≥ 0`. `categoria` debe existir. Ignora `id` del cuerpo. |
| PUT | `/api/productos/{id}` | Reemplaza el producto completo |
| PATCH | `/api/productos/{id}` | Solo los campos enviados (ej. `{"stock": 5}`) |
| DELETE | `/api/productos/{id}` | Borra también sus ofertas |

Campos: `id, codigo, ml, marca, nombre, precio, stock, stockCritico, categoria, familia, estacion, genero, tipo, concentracion, imagen, descripcion, heroFondo, historiaTitulo, historia, historiaImagen, ctaFondo, fondoPagina, ctaTitulo, ctaTexto, navClaro, heroAjuste, humor[], maridaje[], notas{salida[],corazon[],fondo[]}, notasImagenes{}, inspiradoEn{marca,nombre,precioOriginal}, colores{}`.

### Categorías `/api/categorias`
`GET` lista (por nombre) · `GET /{id}` · `POST` (si no viene `id`, se genera el slug desde `nombre`; 409 si ya existe) · `PUT /{id}` · `DELETE /{id}` (**409** si tiene productos).
Campos: `id (slug), nombre, descripcion, imagen`.

### Ofertas `/api/ofertas`
`GET ?activa=true&_expand=producto` (misma forma que usa `ofertasService.listarActivas`: cada oferta con su `producto` dentro) · `GET /{id}` · `POST` · `PUT /{id}` · `DELETE /{id}`.
Campos: `id, productoId, descuento (1-90, entero), etiqueta, vigenteHasta (yyyy-MM-dd), activa`. `productoId` debe existir (400 si no).
El precio final **no** se guarda: `Math.round(precio * (1 - descuento / 100))` en el front.

### Salud
`GET /api/catalogo/salud` → `{ "servicio": "ms-catalogo", "estado": "OK" }`

## ms-usuarios (etapa 16) · puerto 8082 — plan
`/api/usuarios` (CRUD; `id` = RUN normalizado; filtros `?correo=` y `?run=` que usa Registro) y `POST /api/auth/login` → usuario **sin** password (BCrypt). 401 con `{campo: "correo"|"password"}` para mantener `ErrorAuth`.

## ms-ordenes (etapa 17) · puerto 8083 — plan
`/api/ordenes` (CRUD, `?usuarioId=`, `?_sort=fecha&_order=desc`; `id` numérico correlativo) y `/api/mensajes` (contacto). Estructura de la orden: ver `esquema-datos.md`.

## Cambios que requerirá el front (etapa 17)
1. `VITE_API_URL` → URL del gateway.
2. `usuariosService.login` → `POST /auth/login` (misma firma).
3. Verificar que `_sort/_order` y `_expand` se mantienen (ya soportados o planificados).
