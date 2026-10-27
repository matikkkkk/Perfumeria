# Envío de correos asíncrono — ms-ordenes

- Las órdenes se confirman en MySQL antes de notificar al cliente.
- `@TransactionalEventListener(AFTER_COMMIT)` espera al commit y `@Async("correoExecutor")` agenda el envío SMTP en un hilo independiente.
- Se aplica a **boleta de compra** y **avisos de cambios de estado**.
- No hay nuevos cambios en React, la base de datos ni los tests: el endpoint responde sin esperar a Gmail.
- Si un correo falla, el problema aparece en la consola del microservicio de órdenes y la compra permanece guardada.
- **Límite actual (demo universitaria):** la cola de envíos vive en memoria. Si el proceso se detiene o la cola está llena, un correo pendiente puede no enviarse; no existe reintento persistente ni garantía de entrega. Para uso real haría falta una cola duradera o una tabla outbox.

## Cómo probar

1. Iniciar MySQL y el proyecto, habilitando Gmail SMTP como siempre.
2. Comprar un perfume y observar que la confirmación llega antes de recibir el correo.
3. Comprobar la boleta PDF en el correo del comprador.
4. Cambiar una orden a En preparación y comprobar que también llega el aviso sin bloquear el panel.
5. Verificar en la consola `ms-ordenes` los registros `Comprobante enviado` o `Aviso de seguimiento enviado` (o los errores SMTP).

Para compilar desde `backend/ms-ordenes`: `mvn -DskipTests package`. Para ejecutar pruebas Java aparte: `mvn test`. Los tests existentes se conservan sin agregar nuevos.
