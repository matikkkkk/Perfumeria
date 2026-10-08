import { useCallback, useEffect, useRef, useState } from "react";

// Desplegable controlado por React: se cierra al hacer clic fuera, con Escape y cuando cambia
// `cerrarAlCambiar` (se le pasa la ruta actual, así navegar siempre lo cierra).
// Devuelve { ref, abierto, alternar, cerrar }; `ref` va en el contenedor del botón + menú.
export function useDropdown(cerrarAlCambiar) {
  const ref = useRef(null);
  const [abierto, setAbierto] = useState(false);

  const cerrar = useCallback(() => setAbierto(false), []);
  const alternar = useCallback(() => setAbierto((v) => !v), []);

  useEffect(() => {
    setAbierto(false);
  }, [cerrarAlCambiar]);

  useEffect(() => {
    if (!abierto) return undefined;
    const alClic = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    const alTecla = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", alClic);
    document.addEventListener("keydown", alTecla);
    return () => {
      document.removeEventListener("mousedown", alClic);
      document.removeEventListener("keydown", alTecla);
    };
  }, [abierto]);

  return { ref, abierto, alternar, cerrar };
}
