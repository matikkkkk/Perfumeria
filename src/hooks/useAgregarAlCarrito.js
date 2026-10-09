import { useCallback } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";

// Agrega `cantidad` unidades de un producto al carrito y avisa con un toast, con los mismos textos que
// agregarCarrito() / agregarCarritoConCantidad() del HTML.
export function useAgregarAlCarrito() {
  const { agregar } = useCarrito();
  const { mostrarToast } = useToast();

  return useCallback(
    (producto, cantidad = 1) => {
      const resultado = agregar(producto, cantidad);
      if (!resultado.ok) {
        mostrarToast(
          cantidad > 1
            ? `No hay stock suficiente. Disponible: ${Math.max(resultado.stockRestante, 0)} uds.`
            : "No hay más stock disponible.",
          "aviso"
        );
      } else if (resultado.critico) {
        mostrarToast("Producto agregado al carrito. Quedan pocas unidades.", "aviso");
      } else {
        mostrarToast("Producto agregado al carrito.");
      }
      return resultado;
    },
    [agregar, mostrarToast]
  );
}
