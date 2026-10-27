import { peticion } from "./api";
export const alertasStockService = {
  solicitar: (productoId, correo) => peticion(`/alertas-stock/${productoId}`, {
    method: "POST", body: JSON.stringify({ correo }),
  }),
};
