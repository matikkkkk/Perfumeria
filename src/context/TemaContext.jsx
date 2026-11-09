import { createContext, useContext, useEffect, useMemo, useState } from "react";
const TemaContext = createContext(null);
function leerTema() {
  try { return localStorage.getItem("ml-tema-v1") === "claro" ? "claro" : "oscuro"; }
  catch { return "oscuro"; }
}
export function TemaProvider({ children }) {
  const [tema, setTema] = useState(leerTema);
  useEffect(() => {
    const claro = tema === "claro";
    document.body.classList.toggle("modo-claro", claro);
    document.documentElement.dataset.bsTheme = claro ? "light" : "dark";
    document.documentElement.style.colorScheme = claro ? "light" : "dark";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", claro ? "#f4f7f8" : "#101012");
    try { localStorage.setItem("ml-tema-v1", tema); } catch { /* Almacenamiento opcional. */ }
  }, [tema]);
  useEffect(() => {
    const sincronizar = e => { if (e.key === "ml-tema-v1") setTema(leerTema()); };
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);
  const valor = useMemo(() => ({ tema, alternarTema: () => setTema(t => t === "claro" ? "oscuro" : "claro") }), [tema]);
  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}
export function useTema() { return useContext(TemaContext); }
