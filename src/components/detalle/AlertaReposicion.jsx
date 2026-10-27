import { useState } from "react";
import { alertasStockService } from "../../services/alertasStockService";

export default function AlertaReposicion({ producto, usuario }) {
  const [correo, setCorreo] = useState(usuario?.correo || "");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  if (Number(producto?.stock ?? 0) > 0) return null;

  async function solicitar(e) {
    e.preventDefault(); setCargando(true); setMensaje("");
    try {
      const respuesta = await alertasStockService.solicitar(producto.id, correo);
      setMensaje(respuesta.mensaje);
    } catch (error) {
      setMensaje(error.cuerpo?.mensaje || "No se pudo registrar el aviso. Intenta nuevamente.");
    } finally { setCargando(false); }
  }
  return <section className="container py-4" aria-label="Aviso de reposición">
    <div className="admin-panel">
      <h2 className="h4 luxury-title">¿Agotado? Te avisamos cuando vuelva</h2>
      <p className="text-gold-light">Deja tu correo y recibirás un aviso cuando repongamos este perfume.</p>
      <form onSubmit={solicitar} className="d-flex flex-wrap gap-2 align-items-end">
        <label className="flex-grow-1">Correo electrónico
          <input type="email" className="form-control mt-1" required value={correo}
            onChange={e => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" />
        </label>
        <button className="btn btn-luxury" type="submit" disabled={cargando}>
          {cargando ? "Registrando…" : "Avisarme cuando esté disponible"}
        </button>
      </form>
      {mensaje && <p role="status" className="mt-3 mb-0 text-gold-light">{mensaje}</p>}
    </div>
  </section>;
}
