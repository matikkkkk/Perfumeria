// Lógica pura de las vistas de categorías. Sin React ni red.
// El id de la categoría coincide con el valor de producto.categoria (ver docs/esquema-datos.md).

export function productosDeCategoria(productos, categoriaId) {
  return productos.filter((p) => p.categoria === categoriaId);
}

export function textoFragancias(total) {
  return `${total} ${total === 1 ? "fragancia" : "fragancias"}`;
}
