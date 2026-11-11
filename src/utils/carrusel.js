// Lógica pura de los carruseles del home.

// Parte una lista en bloques de `tamano` (el HTML mostraba 4 tarjetas por slide).
export function agruparEnBloques(lista, tamano) {
  const bloques = [];
  for (let i = 0; i < lista.length; i += tamano) bloques.push(lista.slice(i, i + tamano));
  return bloques;
}

// Índice siguiente/anterior con vuelta al otro extremo (el carrusel de Bootstrap es circular).
export function indiceSiguiente(actual, total) {
  return total <= 0 ? 0 : (actual + 1) % total;
}

export function indiceAnterior(actual, total) {
  return total <= 0 ? 0 : (actual - 1 + total) % total;
}

// Qué productos muestra cada sección del home (mismas reglas que script.js).
export const ultimosLanzamientos = (productos, cantidad = 3) => productos.slice(-cantidad);
export const porGenero = (productos, genero, max = 8) => productos.filter((p) => p.genero === genero).slice(0, max);
export const masBuscados = (productos, cantidad = 4) => productos.slice(0, cantidad);
