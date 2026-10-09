import { useCallback, useEffect, useState } from "react";
import { productosService } from "../services/productosService";

// Carga UN producto por id. Distingue "no existe" (404) de "falló la API" para mostrar el mensaje correcto.
// Si el id cambia mientras se espera, se ignora la respuesta vieja.
export function useProducto(id) {
  const [estado, setEstado] = useState({ producto: null, cargando: true, error: null, noEncontrado: false });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;
    setEstado({ producto: null, cargando: true, error: null, noEncontrado: false });
    productosService
      .obtener(id)
      .then((producto) => vigente && setEstado({ producto, cargando: false, error: null, noEncontrado: false }))
      .catch((e) => {
        if (!vigente) return;
        const noEncontrado = e.status === 404;
        setEstado({ producto: null, cargando: false, error: noEncontrado ? null : e.message, noEncontrado });
      });
    return () => {
      vigente = false;
    };
  }, [id, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);
  return { ...estado, recargar };
}
