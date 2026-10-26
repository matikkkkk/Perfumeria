import { crearRecurso, descargarPdf } from "./api";

export const ordenesService = {
  ...crearRecurso("/ordenes"),
  descargarBoleta: (id) => descargarPdf(`/ordenes/${encodeURIComponent(id)}/boleta`, `boleta-luxury-${id}.pdf`),
};
