// Filtra los términos del diccionario. Igual que el HTML: busca el texto (sin importar
// mayúsculas) tanto en el término como en la definición.
export function filtrarTerminos(terminos, texto) {
  const buscado = (texto || "").trim().toLowerCase();
  if (!buscado) return terminos;
  return terminos.filter((t) => `${t.termino} ${t.definicion}`.toLowerCase().includes(buscado));
}
