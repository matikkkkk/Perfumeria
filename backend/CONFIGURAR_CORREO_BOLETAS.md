# Envío automático de comprobantes por correo

El microservicio `ms-ordenes` genera un comprobante PDF de la orden y lo adjunta al email del comprador cuando la orden se guarda por primera vez con estado `Pagado` (POST, PUT o transición PATCH). Se ejecuta después del commit; si falla el envío, la compra sigue guardada.

> Importante: el PDF es un **comprobante interno de compra**, no una boleta tributaria electrónica válida ante el SII. Para documentos tributarios reales se necesita integración autorizada con facturación electrónica.

## Variables de entorno del microservicio ms-ordenes

| Variable | Ejemplo | Descripción |
| --- | --- | --- |
| `MAIL_ENABLED` | `true` | Activar el envío (`false` por defecto) |
| `SMTP_HOST` | `smtp.gmail.com` | Servidor SMTP |
| `SMTP_PORT` | `587` | Puerto TLS |
| `SMTP_USER` | `cuenta@gmail.com` | Usuario de la cuenta de envío |
| `SMTP_PASSWORD` | `CONTRASENA_DE_APLICACION` | Contraseña de aplicación/credencial SMTP, **nunca subir a Git** |
| `MAIL_FROM` | `cuenta@gmail.com` | Remitente autorizado por el servidor |
| `SMTP_AUTH` | `true` | Autenticación SMTP |
| `SMTP_STARTTLS` | `true` | Activar STARTTLS |

Ejemplo para PowerShell (antes de iniciar `ms-ordenes`):

```powershell
$env:MAIL_ENABLED="true"
$env:SMTP_HOST="smtp.gmail.com"
$env:SMTP_PORT="587"
$env:SMTP_USER="tucuenta@gmail.com"
$env:SMTP_PASSWORD="tu-clave-de-aplicacion"
$env:MAIL_FROM="tucuenta@gmail.com"
```

A continuación inicia el backend de la forma habitual. En Gmail, si tienes activada la verificación en dos pasos y tu cuenta es elegible, genera una contraseña de aplicación; **no uses la contraseña normal de Gmail**.

## Probar

1. Iniciar MySQL, Gateway, los microservicios y el frontend como de costumbre.
2. Configurar un SMTP válido para `ms-ordenes` y reiniciarlo.
3. Realizar una compra de prueba y completar el checkout con estado `Pagado` y un correo al que tengas acceso.
4. Verificar el correo y el PDF adjunto `comprobante-<id>.pdf` (revisar spam si fuera necesario).
5. Consultar logs del microservicio si falla; la compra permanece registrada.

## Limitaciones de esta primera etapa

- No se registra un historial de entregas ni hay reintento automático del SMTP fallido.
- Solo se notifica al guardar una orden pagada o cuando cambia a `Pagado`; volver a aplicar el mismo estado no reenvía el correo.
- No se valida una transacción bancaria real: el checkout de demostración marca pagos según la lógica existente. En producción la confirmación de pago debe validarse en el servidor con una pasarela de pagos.
- La seguridad de los endpoints de órdenes debe endurecerse antes de un despliegue público.

## Configuracion integrada en el lanzador (Windows)

Ejecuta `\.\iniciar-perfumeria.ps1` desde PowerShell, en la raiz del proyecto. Despues de configurar MySQL el lanzador preguntara **Enviar boletas por Gmail? (S/N)**. Si respondes `S`, solicita el correo Gmail remitente y la **contrasena de aplicacion**. Esta clave se conserva unicamente como variable de entorno durante el arranque de los procesos y no se escribe en `.env` ni en el ZIP. Se necesita tener habilitada la verificacion en dos pasos en la cuenta Google y disponibilidad de contrasenas de aplicacion.

Gmail queda preconfigurado en `ms-ordenes`: `smtp.gmail.com`, puerto `587`, autenticacion y STARTTLS. Sin credenciales el envio permanece deshabilitado. Para ejecutar el microservicio manualmente sin el lanzador, usa las variables de entorno descritas arriba.

**Seguridad:** evita utilizar una cuenta personal principal para pruebas; usa una cuenta dedicada. El lanzador pone las credenciales en el entorno de los procesos hijos para que Spring Boot las lea; no las subas a repositorios.
