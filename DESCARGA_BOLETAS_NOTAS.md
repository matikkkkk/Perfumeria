# Descarga de boletas del panel cliente

- Endpoint: `GET /api/ordenes/{id}/boleta` por el Gateway (8080) hacia ms-ordenes (8083).
- Se reutiliza `BoletaPdfService` para obtener el mismo tipo de PDF enviado con Gmail.
- Solo permite descargar PDF cuando el pedido tiene estado `Pagado`.
- En `Mi cuenta > Mis boletas`, el botón guarda `boleta-luxury-ID.pdf`; también está disponible para órdenes pagadas en `Mis pedidos`.
- Se conserva el login y el proceso de compra original.

**Limitación de demostración:** el endpoint no exige autenticación en el servidor y una persona que conozca otro número de orden podría descargar su PDF. No usar esta implementación con clientes o información real. Para producción debe habilitarse autorización de servidor.

**Prueba manual:** iniciar todos los servicios, comprar con cliente, abrir `/mi-cuenta/boletas` y descargar. Verificar que una orden `Pendiente` no presenta el botón y que el PDF contiene el pedido correcto.
