# Contrato REST esperado por el frontend

La API mock usa `VITE_API_URL` (por defecto `http://localhost:8080/api`). Los servicios React esperan respuestas JSON y códigos HTTP no exitosos para errores. Los endpoints se deben mantener o adaptar en `src/services` al conectar los microservicios reales.

| Método | Ruta | Uso esperado |
|---|---|---|
| GET/POST | `/productos` | Listar y crear productos |
| GET/PUT/PATCH/DELETE | `/productos/{id}` | Consultar, reemplazar, modificar o eliminar un producto |
| GET/POST | `/categorias` | Listar y crear categorías |
| GET/PUT/PATCH/DELETE | `/categorias/{id}` | Administrar una categoría |
| GET/POST | `/ofertas` | Listar y crear ofertas |
| GET/POST | `/usuarios` | Listar y registrar usuarios (solo modo mock para autenticación) |
| GET/PUT/PATCH/DELETE | `/usuarios/{id}` | Consultar y administrar un usuario |
| GET/POST | `/ordenes` | Consultar y crear órdenes |
| GET/PUT/PATCH/DELETE | `/ordenes/{id}` | Consultar o actualizar el estado de una orden |
| GET/POST | `/mensajes` | Consultar y guardar mensajes de contacto |

## Reglas de compatibilidad
- `usuarios.id` y `usuarios.run` deben conservar el RUN normalizado como identificador.
- El login mock consulta `/usuarios?correo=...`; el backend real debe reemplazarlo por un endpoint de autenticación seguro y nunca devolver contraseñas.
- Las órdenes conservan `usuarioId` solo cuando hay usuario autenticado; para invitado se omite la propiedad.
- Cada orden conserva una copia de los datos de los productos comprados dentro de `items`.
- El checkout crea la orden como `Pendiente` y actualiza su estado según el resultado del pago simulado.
- La URL pública del gateway debe ser la única configurada en `VITE_API_URL`; las rutas internas entre microservicios no se deben llamar directamente desde el navegador.
