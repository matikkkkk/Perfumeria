# Inventario en compras — cambio A

Al crear una orden `Pagado`, o al pasar una orden `Pendiente` a `Pagado` por PUT/PATCH, `ms-ordenes` llama `POST /api/inventario/descontar` del catálogo antes de confirmar la transacción local. El catálogo comprueba las existencias con bloqueo pesimista y descuenta todos los productos dentro de una sola transacción. Si alguna línea no tiene suficientes unidades, devuelve 409 y no descuenta ninguna. Los pedidos `Pendiente` y `Pago fallido` no descuentan existencias.

Se agrega la migración Flyway V6 de catálogo, `descuentos_inventario`, que guarda `ordenId` + cantidades normalizadas: un mismo pedido no puede descontarse dos veces, ni volver a usar su identificador con otro contenido. Una compra pagada no admite reemplazo de líneas por PUT ni eliminación directa.

## Ejemplo

Producto `1` stock 5, orden 123 con cantidad 2:

```http
POST http://localhost:8081/api/inventario/descontar
Content-Type: application/json

{"ordenId":"ordenes:123","items":[{"productoId":1,"cantidad":2}]}
```

Respuesta 204; stock 3. Repetir exactamente el mismo POST no cambia stock. Una nueva orden que pida 4 unidades recibe 409.

## Arranque

Iniciar `ms-catalogo` (puerto 8081) antes de `ms-ordenes` (8083). Si catálogo está en otra dirección, establecer `CATALOGO_URL=http://host:puerto` para órdenes. Flyway aplica automáticamente V6 al iniciar catálogo.

## Límites importantes antes de producción

**No existe transacción distribuida entre H2 de órdenes y H2 de catálogo.** Un fallo de red después de que catálogo confirma el descuento, o un fallo al confirmar la orden local, puede dejar stock descontado sin una orden pagada. El idempotency key disminuye los dobles descuentos pero no resuelve ese caso: requiere reconciliación/outbox y compensación automatizada, o un esquema de reservas con expiración. Tampoco se incluyen reposiciones por cancelaciones/reembolsos ni validación server-side de precios; son tareas independientes necesarias para un checkout productivo. El endpoint de inventario debe quedar restringido a comunicación interna entre servicios (autenticación de servicio) antes de exponerse públicamente.

Pruebas: la suite de órdenes usa un `@MockBean InventarioClient` para aislar la API de catálogo. No se ejecutó Maven en este entorno porque Maven no está instalado: compilar y ejecutar `mvn test` en ambos microservicios en un entorno con JDK 21 y Maven.
