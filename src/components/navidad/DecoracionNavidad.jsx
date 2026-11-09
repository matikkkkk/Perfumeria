import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTemporada } from "../../context/TemporadaContext";

const NIEVE = [
  [4, "14s", "-6s", "6px"], [12, "18s", "-11s", "4px"],
  [22, "21s", "-4s", "5px"], [34, "16s", "-9s", "4px"],
  [46, "20s", "-17s", "5px"], [71, "24s", "-8s", "4px"],
];

export default function DecoracionNavidad() {
  const { activo } = useTemporada();
  const { pathname } = useLocation();
  const [mostrarArbol, setMostrarArbol] = useState(() => {
    try { return sessionStorage.getItem("ml-navidad-arbol-oculto") !== "1"; }
    catch { return true; }
  });
  const [efectos, setEfectos] = useState(() => {
    try { return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && sessionStorage.getItem("ml-navidad-efectos") !== "0"; }
    catch { return false; }
  });
  const [mostrarTrineo, setMostrarTrineo] = useState(false);
  const esAdmin = pathname.startsWith("/admin");
  const esCheckout = pathname.startsWith("/checkout") || pathname.startsWith("/pago-");

  useEffect(() => {
    if (!activo || pathname !== "/") { setMostrarTrineo(false); return; }
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducir) return;
    try {
      if (sessionStorage.getItem("ml-navidad-trineo-v2") === "1") return;
      sessionStorage.setItem("ml-navidad-trineo-v2", "1");
    } catch { /* En navegación privada podemos seguir mostrando el trineo. */ }
    setMostrarTrineo(true);
  }, [activo, pathname]);

  if (!activo) return null;

  return <>
    {!esCheckout && <div className="navidad-cinta-festiva" role="note" aria-label="Edición navideña">
      <span aria-hidden="true">✦</span>
      <span>MAISON LUXURY <strong>CHRISTMAS EDITION</strong></span>
      <span className="navidad-cinta-separador" aria-hidden="true">✧</span>
      <span>Regala una fragancia para recordar</span>
      <button type="button" className="navidad-efectos" aria-pressed={efectos} onClick={() => {
        setEfectos(valor => !valor);
        try { sessionStorage.setItem("ml-navidad-efectos", efectos ? "0" : "1"); } catch { /* Sin persistencia. */ }
      }}>{efectos ? "Pausar efectos" : "Activar efectos"}</button>
    </div>}
    {!esAdmin && <aside className="navidad-promocion" aria-label="Cupón de Navidad"><span>Un detalle para tus regalos: 20 % de descuento con</span><code>NAVIDAD20</code><Link to="/productos">Explorar regalos</Link></aside>}
    {efectos && !esCheckout && !esAdmin && <div className="navidad-nevada" aria-hidden="true">
      {NIEVE.map(([pos, duracion, espera, tamano]) => (
        <i key={pos} style={{ "--pos-x": `${pos}%`, "--duracion": duracion, "--espera": espera, "--tamano": tamano }} />
      ))}
    </div>}
    {efectos && !esCheckout && mostrarTrineo && <img className="navidad-trineo" src="/navidad/adornos/trineo-santa.webp" width="1100" height="440" decoding="async" alt="" aria-hidden="true" onAnimationEnd={() => setMostrarTrineo(false)} />}
    {!esCheckout && !esAdmin && mostrarArbol && (
      <div className="navidad-arbol-flotante">
        <button type="button" className="navidad-arbol-cerrar" aria-label="Ocultar árbol navideño" title="Ocultar adorno" onClick={() => {
          setMostrarArbol(false);
          try { sessionStorage.setItem("ml-navidad-arbol-oculto", "1"); } catch { /* Sin persistencia de sesión. */ }
        }}><i className="bi bi-x-lg" aria-hidden="true" /></button>
        <img src="/navidad/adornos/arbol-regalos.webp" alt="" aria-hidden="true" />
      </div>
    )}
  </>;
}
