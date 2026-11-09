import { crearRecurso, descargarPdf, peticion } from "./api";

export const ordenesService = {
  ...crearRecurso("/ordenes"),
  estadoCorreo: (id) => peticion(`/ordenes/${encodeURIComponent(id)}/boleta/correo`),
  solicitarCorreo: (id) => peticion(`/ordenes/${encodeURIComponent(id)}/boleta/correo`, { method: "POST" }),
  descargarBoleta: (id) => descargarPdf(`/ordenes/${encodeURIComponent(id)}/boleta`, `boleta-luxury-${id}.pdf`),
};
