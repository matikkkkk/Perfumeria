import { crearRecurso, peticion } from "./api";
export const cuponesService = {
  ...crearRecurso("/cupones"),
  validar: (codigo) => peticion(`/cupones/${encodeURIComponent(codigo)}/validar`),
};
