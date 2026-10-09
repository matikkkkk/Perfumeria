import { useCallback } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";

// Agrega un producto al carrito y avisa con un toast, con los mismos textos que agregarCarrito() del HTML.
export function useAgregarAlCarrito() {
  const { agregar } = useCarrito();
  const { mostrarToast } = useToast();

  return useCallback(
    (producto) => {
      const resultado = agregar(producto, 1);
      if (!resultado.ok) {
        mostrarToast("No hay más stock disponible.", "aviso");
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
