import { useCallback, useEffect, useState } from "react";
import { indiceAnterior, indiceSiguiente } from "../utils/carrusel";

// Estado de un carrusel: slide actual + siguiente/anterior/ir. Reemplaza al JS de Bootstrap (data-bs-slide).
// Con `intervaloMs` avanza solo (data-bs-ride="carousel"); sin él solo cambia con los botones.
export function useCarrusel(total, intervaloMs = 0) {
  const [indice, setIndice] = useState(0);

  const siguiente = useCallback(() => setIndice((i) => indiceSiguiente(i, total)), [total]);
  const anterior = useCallback(() => setIndice((i) => indiceAnterior(i, total)), [total]);
  const ir = useCallback((i) => setIndice(i), []);

  // Si la lista se acorta (p. ej. recarga de datos), el índice no puede quedar fuera de rango.
  useEffect(() => {
    if (indice >= total && total > 0) setIndice(0);
  }, [indice, total]);

  // Al reiniciar el temporizador con cada cambio de `indice`, un clic manual también reinicia la cuenta.
  useEffect(() => {
    if (!intervaloMs || total < 2) return undefined;
    const temporizador = setTimeout(siguiente, intervaloMs);
    return () => clearTimeout(temporizador);
  }, [indice, intervaloMs, total, siguiente]);

  return { indice, siguiente, anterior, ir };
}
