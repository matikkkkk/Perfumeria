# Panel de cliente – estado y seguridad

- URL: `/mi-cuenta` (Cliente), con menú lateral y vistas de pedidos, boletas, perfil y cambio de contraseña.
- Cambio de contraseña: `POST /api/usuarios/{run}/cambiar-password`, comprueba el secreto anterior con BCrypt, valida nueva contraseña y guarda solo hash.
- El historial filtra por `usuarioId` del login y **no incluye compras como invitado**.
- El comprobante PDF se sigue enviando por Gmail. **No se implementó descarga directa de PDF**, porque actualmente la API no autentica solicitudes ni valida propiedad de una orden.
- **Seguridad pendiente antes de producción:** el backend usa login sin JWT/cookie de sesión; los listados `/api/ordenes`, `/api/usuarios` y endpoints CRUD existentes no tienen protección real por roles/propiedad. El filtro de cliente en React NO es un control de acceso seguro. El cambio de contraseña verifica la anterior, pero es necesario implementar autentificación robusta de todos los endpoints (y protección adicional ante fuerza bruta). No desplegar esto en Internet con datos reales hasta resolverlo.
- La edición de perfil utiliza el PATCH existente y tiene la misma limitación de autenticación; se requiere autorización server-side.
- Pruebas recomendadas: login Cliente, vistas, filtro de pedidos, validación de contraseña incorrecta/correcta, edición de perfil, y ausencia de acceso con rol staff. Ejecutar `npm run test:run` y `mvn test` en un equipo con dependencias.
