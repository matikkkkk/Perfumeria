import { crearRecurso, peticion } from "./api";

export const ofertasService = {
  ...crearRecurso("/ofertas"),
  // Ofertas activas con su producto incluido: [{ id, productoId, descuento, ..., producto: {...} }]
  listarActivas: () => peticion("/ofertas?activa=true&_expand=producto"),
};
