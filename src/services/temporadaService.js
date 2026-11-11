import { peticion } from "./api";

export const temporadaService = {
  consultar: () => peticion("/temporada", { cache: "no-store" }),
  guardar: (modo) => peticion("/temporada", {
    method: "PUT",
    body: JSON.stringify({ modo }),
  }),
};
