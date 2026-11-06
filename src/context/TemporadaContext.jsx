import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { temporadaService } from "../services/temporadaService";

const TemporadaContext = createContext(null);

function navidadPorCalendario() {
  // No depende de la zona horaria del computador que abre la tienda.
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago", month: "numeric", day: "numeric",
  }).formatToParts(new Date());
  const mes = Number(partes.find((p) => p.type === "month")?.value);
  const dia = Number(partes.find((p) => p.type === "day")?.value);
  return mes === 12 && dia >= 1 && dia <= 26;
}

function normalizarEstado(respuesta) {
  const modo = ["automatico", "navidad", "normal"].includes(respuesta?.modo)
    ? respuesta.modo : "automatico";
  return {
    modo,
    activo: typeof respuesta?.activo === "boolean"
      ? respuesta.activo
      : modo === "navidad" || (modo === "automatico" && navidadPorCalendario()),
    descripcion: respuesta?.descripcion || "",
  };
}

function estadoInicial() {
  // Si la API aún no ha respondido, auto por fecha; nunca se supone un modo manual ficticio.
  return normalizarEstado({ modo: "automatico" });
}

export function TemporadaProvider({ children }) {
  const [estado, setEstado] = useState(estadoInicial);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    try {
      const resultado = await temporadaService.consultar();
      setEstado(normalizarEstado(resultado));
      setError("");
      return resultado;
    } catch {
      setError("No se pudo consultar el modo Navidad. Revisa Catálogo y Gateway.");
      setEstado((previo) => previo.modo === "automatico" ? estadoInicial() : previo);
      return null;
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
    const intervalo = window.setInterval(recargar, 60000);
    const alVolver = () => {
      if (document.visibilityState === "visible") recargar();
    };
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [recargar]);

  useEffect(() => {
    const clase = "modo-navidad";
    document.body.classList.toggle(clase, estado.activo);
    return () => document.body.classList.remove(clase);
  }, [estado.activo]);

  const guardarModo = useCallback(async (modo) => {
    const respuesta = await temporadaService.guardar(modo);
    setEstado(normalizarEstado(respuesta));
    setError("");
    return respuesta;
  }, []);

  const valor = useMemo(() => ({
    ...estado, cargando, error, recargar, guardarModo,
  }), [estado, cargando, error, recargar, guardarModo]);

  return <TemporadaContext.Provider value={valor}>{children}</TemporadaContext.Provider>;
}

export function useTemporada() {
  const contexto = useContext(TemporadaContext);
  if (!contexto) throw new Error("useTemporada necesita TemporadaProvider");
  return contexto;
}
