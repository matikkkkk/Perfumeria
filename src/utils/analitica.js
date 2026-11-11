// Resúmenes calculados a partir de las órdenes y el catálogo existentes.
export const esVenta = (estado) => ["pagado", "completado", "aprobado", "en preparación", "en preparacion", "enviado", "entregado"].includes(String(estado || "").toLowerCase().trim());
export const ventasConfirmadas = (ordenes = []) => ordenes.filter((orden) => esVenta(orden.estado));
const numero = (valor) => Number(valor) || 0;
export function calcularAnalitica(ordenes = [], productos = []) {
  const ventas = ventasConfirmadas(ordenes);
  const meses = new Map();
  const ranking = new Map();
  const categorias = new Map();
  const catalogo = new Map(productos.map((p) => [String(p.id), p]));
  ventas.forEach((orden) => {
    const fecha = orden.fecha ? new Date(orden.fecha) : null;
    if (fecha && !Number.isNaN(fecha.getTime())) {
      const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
      const actual = meses.get(clave) || { clave, pedidos: 0, ingresos: 0 };
      actual.pedidos += 1;
      actual.ingresos += numero(orden.total);
      meses.set(clave, actual);
    }
    (orden.items || []).forEach((item) => {
      const id = String(item.productoId ?? item.id ?? item.nombre);
      const producto = catalogo.get(id);
      const cantidad = numero(item.cantidad);
      const importe = numero(item.subtotal ?? (numero(item.precio) * cantidad));
      const anterior = ranking.get(id) || { id, nombre: producto?.nombre || item.nombre || "Producto", unidades: 0, ingresos: 0 };
      anterior.unidades += cantidad;
      anterior.ingresos += importe;
      ranking.set(id, anterior);
      const categoria = String(producto?.categoria || item.categoria || "Sin categoría");
      categorias.set(categoria, (categorias.get(categoria) || 0) + importe);
    });
  });
  const inventario = { disponibles: 0, criticos: 0, agotados: 0 };
  productos.forEach((p) => {
    const stock = numero(p.stock);
    if (stock <= 0) inventario.agotados++;
    else if (stock <= numero(p.stockCritico ?? 2)) inventario.criticos++;
    else inventario.disponibles++;
  });
  return {
    meses: [...meses.values()].sort((a, b) => a.clave.localeCompare(b.clave)).slice(-12).map((m) => ({ ...m, etiqueta: new Date(`${m.clave}-01T12:00:00`).toLocaleDateString("es-CL", { month: "short", year: "2-digit" }) })),
    ranking: [...ranking.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 8),
    categorias: [...categorias].map(([nombre, ingresos]) => ({ nombre, ingresos })).sort((a, b) => b.ingresos - a.ingresos),
    inventario,
    ingresos: ventas.reduce((total, orden) => total + numero(orden.total), 0),
    pedidos: ventas.length,
  };
}
