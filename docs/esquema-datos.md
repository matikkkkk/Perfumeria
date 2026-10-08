# Esquema de datos (etapa 1)

Fuente: `seed/*.js` → `npm run api:seed` → `mock-api/db.json` → json-server (`npm run api`, puerto 8080).
Cada colección será después una entidad/tabla en Spring Boot; los campos ya están pensados para eso.

| Colección | id | Descripción |
|---|---|---|
| `productos` (42) | string `"1"`…`"42"` | Catálogo. Campo `categoria` = id de una categoría. |
| `categorias` (3) | slug: `ligeros`, `moderados`, `intensos` | Intensidad del perfume. El id es el valor de `producto.categoria`. |
| `ofertas` (6) | string | Descuento sobre un producto. |
| `usuarios` (3) | RUN sin puntos ni guion | Roles: `Administrador`, `Vendedor`, `Cliente`. |
| `ordenes` (3) | número correlativo | Compra con foto de los productos y del cliente. |
| `mensajes` (0) | auto | Formulario de contacto. |

## categorias
`{ id, nombre, descripcion, imagen }` — Hoy no hay productos "ligeros" (0); la categoría existe porque el formulario admin del HTML la ofrece.

## ofertas
`{ id, productoId, descuento, etiqueta, vigenteHasta, activa }`
- `descuento` es un porcentaje entero (15 = 15 %).
- El precio con oferta **no se guarda**: `Math.round(precio * (1 - descuento / 100))`.
- Una oferta está vigente si `activa === true` y `vigenteHasta` no ha pasado.
- `/ofertas?activa=true&_expand=producto` devuelve cada oferta con su producto dentro.

## ordenes
```js
{
  id: 4,                                   // lo asigna json-server; nº de boleta = String(id).padStart(6, "0")
  fecha: "2026-10-05T22:40:00.000Z",       // ISO (ordenable y filtrable por rango en reportes)
  estado: "Pendiente" | "Pagado" | "Pago fallido",
  usuarioId: "20987654K",                  // OMITIR si compra como invitado (ver aviso)
  cliente: { nombre, apellidos, correo },
  envio: { calle, departamento, region, comuna, indicaciones },
  items: [{ productoId, codigo, nombre, marca, imagen, precio, cantidad, subtotal }],
  subtotal, cupon /* "LUXURY10" | null */, descuento, total,   // enteros en CLP
  pago: { metodo: "Tarjeta", tarjetaFinal: "4242" }             // nunca el número completo
}
```
- `items` copia nombre/precio/imagen del producto al comprar: si el precio cambia después, la boleta no cambia.
- Flujo del checkout: crear la orden con `Pendiente` → simular el pago → `modificar(id, { estado })`. "Volver a realizar el pago" reutiliza la misma orden.
- Historial de compras de un usuario: `/ordenes?usuarioId=<run>&_sort=fecha&_order=desc`.
- La boleta no es una colección: es la misma orden mostrada como documento.

## usuarios
`{ id (= run), run, nombre, apellidos, correo (minúsculas), password, fechaNacimiento, tipo, region, comuna, direccion }`
- `login(correo, password)` consulta `/usuarios?correo=…` y devuelve el usuario **sin** `password`. Lanza `ErrorAuth` con `campo` = `"correo"` o `"password"`.
- Guardar siempre el correo en minúsculas (el filtro de json-server distingue mayúsculas).
- Las contraseñas están en texto plano solo porque es un mock. Con Spring Boot: BCrypt y `POST /auth/login`.

## Reglas de json-server que afectan el diseño
1. **Nunca `usuarioId: null` (ni ningún `xxxId: null`).** Tras cualquier `DELETE`, json-server revisa todos los documentos y con un `null` responde 500 en *todos* los borrados. Para un invitado, no se envía el campo.
2. **Borrado en cascada automático.** Tras un `DELETE`, json-server elimina todo documento cuyo `xxxId` apunte a algo que ya no existe. Borrar un producto borra sus ofertas (deseado). Borrar un usuario **borra sus órdenes** (historial perdido): en el admin, mejor no ofrecer eliminar usuarios con compras. Los `items[].productoId` de una orden están anidados y no se ven afectados.
3. `PUT` reemplaza el objeto completo; `PATCH` (`modificar`) cambia solo los campos enviados.
