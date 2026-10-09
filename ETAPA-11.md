# Etapa 11 — Administración: layout, dashboard, órdenes y perfil

## Implementado
- Se completó el layout administrativo con identidad Luxury, navegación lateral, iconos y enlaces según rol.
- El menú conserva las restricciones de acceso existentes para Administrador y Vendedor.
- El Dashboard consulta órdenes, productos y usuarios mediante sus servicios REST.
- El Dashboard muestra ventas pagadas, órdenes totales, productos, usuarios, órdenes recientes y stock crítico.
- La vista Órdenes consulta la API, ordena por fecha y permite buscar por número, nombre o correo.
- Se agregó filtro por estado y acceso directo a la boleta de cada orden.
- La boleta muestra cliente, despacho, productos, cantidades, precios, descuentos, total y método de pago.
- La boleta conserva la opción de imprimir y se agregaron reglas de impresión.
- Perfil permite editar nombre, apellidos, correo y datos de dirección.
- Los cambios del perfil se guardan mediante PATCH y actualizan la sesión actual sin reemplazar contraseña ni rol.
- Se agregaron pruebas Vitest para LayoutAdmin, DashboardAdmin, OrdenesAdmin, BoletaOrden y PerfilAdmin.
- Se agregaron estilos responsive para escritorio y móvil.

## Pendiente de validar
- Ejecutar `npm run test:run` y `npm run build` en un entorno con la dependencia nativa de Rolldown disponible.
- Probar manualmente roles Administrador/Vendedor, API encendida, edición de perfil y la impresión de boleta.
- Crear el commit desde el repositorio Git local original; el ZIP de la etapa 10 no contiene la carpeta `.git`.
