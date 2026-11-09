import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTemporada } from "../../context/TemporadaContext";

import { useTema } from "../../context/TemaContext";

const modos = [
  {
    id: "automatico", titulo: "Automático",
    subtitulo: "Navidad del 1 al 26 de diciembre, usando la fecha de Chile. Fuera de ese período vuelve el diseño normal.",
    icono: "bi-calendar3",
  },
  {
    id: "navidad", titulo: "Navidad activada",
    subtitulo: "Activa inmediatamente toda la decoración para verla en noviembre o en cualquier momento.",
    icono: "bi-gift",
  },
  {
    id: "normal", titulo: "Modo normal",
    subtitulo: "Oculta la edición navideña incluso si estamos en diciembre.",
    icono: "bi-moon-stars",
  },
];

export default function TemporadaAdmin() {
  const { tema } = useTema();
  const { modo, activo, error: errorCarga, cargando, recargar, guardarModo } = useTemporada();
  const [seleccion, setSeleccion] = useState(modo);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");

  useEffect(() => setSeleccion(modo), [modo]);

  async function guardar(evento) {
    evento.preventDefault();
    setGuardando(true);
    setMensaje("");
    setErrorGuardado("");
    try {
      await guardarModo(seleccion);
      setMensaje("Temporada actualizada. El cambio ya está disponible para la tienda y se conserva al reiniciar.");
    } catch (error) {
      setErrorGuardado(error.cuerpo?.mensaje || "No se pudo guardar. Comprueba que Catálogo y Gateway estén iniciados.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="admin-page temporada-admin container-fluid py-2">
      <span className="admin-eyebrow">PRESENTACIÓN DE LA TIENDA</span>
      <h1 className="luxury-title display-5 mb-2">Temporadas</h1>
      <p className="text-gold-light mb-4">Controla cuándo Maison Luxury muestra su edición navideña, sin modificar sus páginas ni sus datos.</p>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-xl-7">
          <form className="admin-panel navidad-admin-form" onSubmit={guardar}>
            <div className="d-flex align-items-center flex-wrap gap-3 justify-content-between mb-4">
              <h2 className="h4 luxury-title mb-0">Modo de temporada</h2>
              <span className={`navidad-estado-pill ${activo ? "activo" : ""}`}>{activo ? "Navidad visible" : "Diseño normal"}</span>
            </div>
            {modos.map((item) => (
              <label className={`navidad-admin-opcion ${seleccion === item.id ? "elegido" : ""}`} key={item.id}>
                <input type="radio" name="temporada" value={item.id} checked={seleccion === item.id} onChange={() => { setSeleccion(item.id); setMensaje(""); }} disabled={guardando || cargando} />
                <i className={`bi ${item.icono}`} aria-hidden="true" />
                <span><strong>{item.titulo}</strong><small>{item.subtitulo}</small></span>
              </label>
            ))}
            {errorCarga && <div className="alert alert-warning mt-3" role="alert">{errorCarga} <button type="button" className="btn btn-sm btn-outline-dark ms-2" onClick={recargar}>Reintentar</button></div>}
            {errorGuardado && <div className="alert alert-danger mt-3" role="alert">{errorGuardado}</div>}
            {mensaje && <div className="alert alert-success mt-3" role="status">{mensaje}</div>}
            <div className="d-flex gap-2 align-items-center flex-wrap mt-4">
              <button type="submit" className="btn btn-luxury btn-luxury--primary" disabled={guardando || cargando || !!errorCarga || seleccion === modo}>
                {guardando ? "Guardando…" : "Guardar temporada"}
              </button>
              <Link to="/" className="btn btn-outline-light" target="_blank" rel="noreferrer">Ver la tienda <i className="bi bi-box-arrow-up-right ms-2" /></Link>
            </div>
            <p className="small text-gold-light mt-3 mb-0">El cambio es para todos los visitantes. Otros navegadores lo reciben al abrir la tienda, regresar a la pestaña o dentro de un minuto.</p>
          </form>
        </div>
        <div className="col-12 col-xl-5">
          <div className="admin-panel navidad-admin-vista">
            <img src={tema === "claro" ? "/navidad/home/hero-claro.webp" : "/navidad/home/hero.webp"} alt="Vista previa de la boutique Maison Luxury decorada en Navidad" loading="lazy" />
            <div className="p-4"><span className="admin-eyebrow">EDICIÓN ESTACIONAL</span><h2 className="h4 luxury-title mt-2">Maison Luxury Christmas</h2><p className="text-gold-light mb-0">Árbol navideño, guirnaldas, nuevas imágenes del Home, gorritos en las tarjetas y un pequeño trineo de bienvenida.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
