// Lógica pura de las ofertas. Sin React ni red.
// Una oferta guarda solo el % de descuento (docs/esquema-datos.md): el precio final se calcula aquí.

// Precio con descuento, redondeado a peso entero. El % se limita a 0-100.
export function precioConOferta(precio, descuento) {
  const porcentaje = Math.min(100, Math.max(0, Number(descuento) || 0));
  return Math.round(Number(precio) * (1 - porcentaje / 100));
}

const dosDigitos = (n) => String(n).padStart(2, "0");

// Fecha local como "AAAA-MM-DD" (mismo formato que `vigenteHasta`, así se comparan como texto).
export function fechaISO(fecha = new Date()) {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
}

// "2026-12-31" -> "31/12/2026"
export function formatearFechaCorta(iso) {
  const [anio, mes, dia] = String(iso ?? "").split("-");
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : "";
}

// Vigente = activa y con fecha de término de hoy en adelante (el último día cuenta completo).
export function ofertaVigente(oferta, hoy = new Date()) {
  if (!oferta.activa) return false;
  if (!oferta.vigenteHasta) return true;
  return oferta.vigenteHasta >= fechaISO(hoy);
}

// Cruza ofertas y productos. Devuelve [{ oferta, producto, precioOferta, ahorro }].
// - Descarta ofertas vencidas, inactivas o que apuntan a un producto que ya no existe.
// - Si un producto tiene más de una oferta vigente, se queda con la de mayor descuento.
export function productosEnOferta(ofertas, productos, hoy = new Date()) {
  const porId = new Map(productos.map((p) => [String(p.id), p]));
  const mejores = new Map();

  ofertas.filter((o) => ofertaVigente(o, hoy)).forEach((o) => {
    const clave = String(o.productoId);
    if (!porId.has(clave)) return;
    const actual = mejores.get(clave);
    if (!actual || o.descuento > actual.descuento) mejores.set(clave, o);
  });

  return [...mejores.entries()].map(([clave, oferta]) => {
    const producto = porId.get(clave);
    const precioOferta = precioConOferta(producto.precio, oferta.descuento);
    return { oferta, producto, precioOferta, ahorro: producto.precio - precioOferta };
  });
}

// Etiquetas distintas ("Verano", "Liquidación"...) en el orden en que aparecen.
export function etiquetasDeOfertas(items) {
  return [...new Set(items.map((i) => i.oferta.etiqueta).filter(Boolean))];
}

// etiqueta vacía = todas.
export function filtrarPorEtiqueta(items, etiqueta) {
  return etiqueta ? items.filter((i) => i.oferta.etiqueta === etiqueta) : items;
}

// Copia ordenada. Mismos valores que el selector del catálogo (BarraResultados);
// aquí "destacados" significa mayor descuento primero y los precios se comparan con el precio de oferta.
export function ordenarOfertas(items, orden) {
  const copia = [...items];
  if (orden === "precio-asc") copia.sort((a, b) => a.precioOferta - b.precioOferta);
  else if (orden === "precio-desc") copia.sort((a, b) => b.precioOferta - a.precioOferta);
  else if (orden === "nombre-az") copia.sort((a, b) => a.producto.nombre.localeCompare(b.producto.nombre, "es"));
  else copia.sort((a, b) => b.oferta.descuento - a.oferta.descuento);
  return copia;
}
