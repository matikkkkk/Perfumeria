import { useState } from "react";
import { estrellas, iniciales, promedioResenas } from "../../utils/productoDetalle";
import { resenasService } from "../../services/resenasService";

export default function ResenasProducto({ productoId, usuario, resenas = [], error, onNuevaResena }) {
  const [estrellasValor, setEstrellasValor] = useState(5);
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const yaOpino = resenas.some(r => String(r.usuarioId) === String(usuario?.id));
  async function quitar(id) {
    if (!window.confirm("¿Eliminar esta reseña?")) return;
    try { await resenasService.eliminar(id); await onNuevaResena(); }
    catch { setMensaje("No se pudo eliminar la reseña."); }
  }
  async function publicar(evento) {
    evento.preventDefault();
    setEnviando(true); setMensaje("");
    try {
      await resenasService.crear({ productoId: Number(productoId), usuarioId: String(usuario.id),
        nombre: [usuario.nombre, usuario.apellidos].filter(Boolean).join(" ") || "Cliente",
        estrellas: Number(estrellasValor), texto: texto.trim() });
      setTexto(""); setMensaje("¡Reseña publicada correctamente!");
      await onNuevaResena();
    } catch (e) {
      setMensaje(e.cuerpo?.mensaje || "No se pudo publicar. Recuerda que debes haber comprado el perfume y solo puedes opinar una vez.");
    } finally { setEnviando(false); }
  }
  return (
    <section className="reviews-section">
      <div className="container">
        <div className="text-center mb-4">
          <span className="text-tema-dorado text-uppercase tracking-wider fs-7">Reseñas de clientes</span>
          <h3 className="luxury-title fst-italic mb-1">
            {promedioResenas(resenas)} <span className="estrellas" aria-hidden="true">★</span>
            <span className="visually-hidden"> de 5 estrellas de promedio</span>
          </h3>
          <p className="text-gold-light">{resenas.length} {resenas.length === 1 ? "opinión" : "opiniones"}</p>
        </div>
        {error && <p role="alert">{error}</p>}
        {!error && resenas.length === 0 && <p className="text-center text-gold-light">Este perfume aún no tiene reseñas. ¡Sé el primero en opinar!</p>}
        <div className="row g-4">
          {resenas.map((r) => (
            <div className="col-md-4" key={r.id}>
              <article className="review-card">
                <span className="estrellas" role="img" aria-label={`${r.estrellas} de 5 estrellas`}>{estrellas(r.estrellas)}</span>
                <p>“{r.texto}”</p>
                <div className="d-flex align-items-center gap-2 mt-3">
                  <span className="review-avatar" aria-hidden="true">{iniciales(r.nombre)}</span>
                  <span className="review-nombre">{r.nombre}</span>
                </div>
                <small className="text-gold-light">{r.fecha ? new Date(r.fecha).toLocaleDateString("es-CL") : ""}</small>
                {["Administrador", "Vendedor"].includes(usuario?.tipo) && (
                  <button className="btn btn-outline-danger btn-sm d-block mt-2" type="button" onClick={() => quitar(r.id)}>Eliminar reseña</button>
                )}
              </article>
            </div>
          ))}
        </div>
        {usuario?.tipo === "Cliente" && !yaOpino && (
          <form className="review-card mt-4 mx-auto" style={{ maxWidth: 600 }} onSubmit={publicar}>
            <h4 className="mb-3">Deja tu opinión</h4>
            <p className="text-gold-light">Disponible para clientes que hayan comprado este perfume.</p>
            <label className="d-block mb-2" htmlFor="calificacion-resena">Calificación</label>
            <select id="calificacion-resena" className="form-select mb-3" value={estrellasValor} onChange={e => setEstrellasValor(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} estrellas</option>)}
            </select>
            <label className="d-block mb-2" htmlFor="texto-resena">Comentario</label>
            <textarea id="texto-resena" className="form-control mb-3" maxLength={1000} required rows={3} value={texto} onChange={e => setTexto(e.target.value)} />
            <button className="btn btn-luxury" type="submit" disabled={enviando || !texto.trim()}>{enviando ? "Publicando..." : "Publicar reseña"}</button>
            {mensaje && <p className="mt-2" role="status">{mensaje}</p>}
          </form>
        )}
        {mensaje && ["Administrador", "Vendedor"].includes(usuario?.tipo) && <p role="status">{mensaje}</p>}
        {yaOpino && <p className="mt-3 text-center text-gold-light">Ya publicaste tu opinión sobre este perfume.</p>}
      </div>
    </section>
  );
}
