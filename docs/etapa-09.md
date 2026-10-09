# Etapa 9 - Checkout, pagos y boleta

## Hecho
- Checkout React con datos del cliente, dirección de envío, tarjeta de prueba y resumen de carrito/cupón.
- Validaciones básicas de tarjeta, vencimiento y CVV; mensajes de error y estado de procesamiento.
- Guardado de la orden con `ordenesService.crear()` (`POST /ordenes`), con snapshot de productos, precios, cantidades, cliente, envío, cupón, totales y últimos cuatro dígitos de tarjeta.
- Pago simulado: tarjeta terminada en `0000` genera estado `Pago fallido`; otra tarjeta con formato válido genera `Pagado`.
- Pago correcto presenta comprobante e impresión; pago fallido permite volver al carrito.
- Boleta administrativa en `/admin/ordenes/:id` con detalle e impresión.
- `Checkout.spec.jsx`: una prueba de eventos con Vitest y Testing Library para tarjeta inválida.

## Pendiente
- Ejecutar `npm run test:run` y `npm run build` en un entorno con dependencias instaladas; no quedaron verificados aquí porque `vitest` no estaba disponible tras fallar la instalación de dependencias.
- Probar manualmente ambos resultados con JSON Server (`npm run api`) y confirmar las órdenes en `mock-api/db.json`.
- El stock no se descuenta aún; integrar el ajuste transaccional con los microservicios en las etapas posteriores.
- Revisar los datos de sesión y el flujo de invitado con la respuesta real del endpoint de usuarios.

## Verificación
`npm run test:run` · `npm run build`
