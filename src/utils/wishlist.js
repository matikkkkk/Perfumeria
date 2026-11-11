// Lógica pura de la lista de deseos: es solo un arreglo de ids de producto.

// Si el id está lo quita; si no está lo agrega. No modifica el arreglo original.
export function alternarId(ids, id) {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}
