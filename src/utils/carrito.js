// Lógica pura del carrito (sin React): recibe una lista de items y devuelve una lista nueva.
// CarritoContext solo guarda el estado y llama a estas funciones.
//
// Item del carrito: { productoId, codigo, nombre, marca, imagen, precio, cantidad, stock, stockCritico }
// `stock` y `stockCritico` son una copia del producto al agregarlo, para validar cantidades sin volver a pedirlo a la API.

export function cantidadTotal(items) {
  return items.reduce((suma, i) => suma + i.cantidad, 0);
}

export function subtotalItems(items) {
  return items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
}

// Agrega `cantidad` unidades de un producto (objeto de /productos).
// Devuelve { items, resultado }. resultado = { ok, motivo?, cantidad, stockRestante, critico }
//   - ok:false, motivo:"sin_stock" -> no se modifica nada (el HTML mostraba un alert con el stock disponible)
//   - critico: true si tras agregar quedan <= stockCritico unidades (el HTML mostraba el toast "Quedan pocas unidades")
// Para vender con oferta, pasar { ...producto, precio: precioConOferta }.
export function agregarItem(items, producto, cantidad = 1) {
  const pedida = Math.max(1, Math.floor(Number(cantidad)) || 1);
  const existente = items.find((i) => i.productoId === producto.id);
  const total = (existente ? existente.cantidad : 0) + pedida;

  if (total > producto.stock) {
    return {
      items,
      resultado: {
        ok: false,
        motivo: "sin_stock",
        cantidad: existente ? existente.cantidad : 0,
        stockRestante: producto.stock - (existente ? existente.cantidad : 0),
        critico: false,
      },
    };
  }

  const nuevos = existente
    ? items.map((i) => (i.productoId === producto.id ? { ...i, cantidad: total } : i))
    : [
        ...items,
        {
          productoId: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          marca: producto.marca,
          imagen: producto.imagen,
          precio: producto.precio,
          cantidad: total,
          stock: producto.stock,
          stockCritico: producto.stockCritico ?? 0,
        },
      ];

  const stockRestante = producto.stock - total;
  return {
    items: nuevos,
    resultado: { ok: true, cantidad: total, stockRestante, critico: stockRestante <= (producto.stockCritico ?? 0) },
  };
}

// Suma o resta unidades (botones − / +). Si queda en 0 o menos, el item se elimina.
// Devuelve { items, ok, motivo? }; sumar por sobre el stock no modifica nada.
export function cambiarCantidadItem(items, productoId, cambio) {
  const item = items.find((i) => i.productoId === productoId);
  if (!item) return { items, ok: false, motivo: "no_existe" };

  const nueva = item.cantidad + cambio;
  if (cambio > 0 && nueva > item.stock) return { items, ok: false, motivo: "sin_stock" };

  const nuevos =
    nueva <= 0
      ? items.filter((i) => i.productoId !== productoId)
      : items.map((i) => (i.productoId === productoId ? { ...i, cantidad: nueva } : i));
  return { items: nuevos, ok: true };
}

export function quitarItem(items, productoId) {
  return items.filter((i) => i.productoId !== productoId);
}

// Convierte los items del carrito al formato de `ordenes.items` (docs/esquema-datos.md):
// copia el precio del momento y agrega `subtotal`; descarta stock/stockCritico.
export function aItemsOrden(items) {
  return items.map(({ productoId, codigo, nombre, marca, imagen, precio, cantidad }) => ({
    productoId, codigo, nombre, marca, imagen, precio, cantidad, subtotal: precio * cantidad,
  }));
}
