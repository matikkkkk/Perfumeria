import { useCallback, useEffect, useState } from "react";

// Carga la lista de un servicio y expone el estado de la peticion.
// Tras crear/actualizar/eliminar, llamar a recargar() para refrescar la interfaz.
export function useRecurso(servicio) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setDatos(await servicio.listar());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [servicio]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { datos, cargando, error, recargar };
}
