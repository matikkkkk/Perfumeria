import { useEffect, useState } from "react";
import { cuponesService } from "../../services/cuponesService";

const vacio = { codigo: "", descuento: 10, activo: true, vigenteDesde: "", vigenteHasta: "" };
const normalizar = (c) => ({ ...c, vigenteDesde: c.vigenteDesde || null, vigenteHasta: c.vigenteHasta || null });
export default function CuponesAdmin() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  async function cargar() {
    try { setLista(await cuponesService.listar()); } catch { setError("No se pudieron consultar los cupones."); }
  }
  useEffect(() => { cargar(); }, []);
  async function guardar(e) {
    e.preventDefault(); setError(""); setMensaje("");
    if (form.vigenteDesde && form.vigenteHasta && form.vigenteDesde > form.vigenteHasta) {
      setError("La fecha final debe ser posterior a la inicial."); return;
    }
    try {
      if (editando) await cuponesService.actualizar(editando, normalizar(form));
      else await cuponesService.crear(normalizar({ ...form, codigo: form.codigo.trim().toUpperCase() }));
      setMensaje(editando ? "Cupón actualizado." : "Cupón creado.");
      setForm(vacio); setEditando(null); await cargar();
    } catch (err) { setError(err.status === 409 ? "Este código ya existe." : "No se pudo guardar el cupón."); }
  }
  async function alternar(c) {
    try { await cuponesService.actualizar(c.codigo, { ...c, activo: !c.activo }); await cargar(); }
    catch { setError("No se pudo cambiar el estado del cupón."); }
  }
  function editar(c) { setEditando(c.codigo); setForm({ ...c, vigenteDesde: c.vigenteDesde || "", vigenteHasta: c.vigenteHasta || "" }); setMensaje(""); }
  return <section className="admin-page container-fluid py-2">
    <span className="admin-eyebrow">PROMOCIONES</span><h1 className="luxury-title display-5 mb-3">Gestión de cupones</h1>
    <p className="text-gold-light">Crea descuentos y controla cuándo pueden aplicarse en el carrito.</p>
    {error && <p role="alert" className="alert alert-danger">{error}</p>}
    {mensaje && <p role="status" className="alert alert-success">{mensaje}</p>}
    <form className="admin-panel mb-4" onSubmit={guardar}>
      <h2 className="h5 luxury-title">{editando ? `Editar ${editando}` : "Nuevo cupón"}</h2>
      <div className="row g-3">
        <div className="col-md-4"><label className="form-label" htmlFor="codigoCupon">Código</label><input id="codigoCupon" className="form-control" required minLength="3" maxLength="40" pattern="[A-Za-z0-9_-]{3,40}" disabled={!!editando} value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value.toUpperCase() })}/></div>
        <div className="col-md-2"><label className="form-label" htmlFor="descuentoCupon">Descuento (%)</label><input id="descuentoCupon" className="form-control" type="number" min="1" max="90" required value={form.descuento} onChange={e => setForm({ ...form, descuento: Number(e.target.value) })}/></div>
        <div className="col-md-3"><label className="form-label" htmlFor="inicioCupon">Válido desde</label><input id="inicioCupon" className="form-control" type="date" value={form.vigenteDesde} onChange={e => setForm({ ...form, vigenteDesde: e.target.value })}/></div>
        <div className="col-md-3"><label className="form-label" htmlFor="finCupon">Válido hasta</label><input id="finCupon" className="form-control" type="date" value={form.vigenteHasta} onChange={e => setForm({ ...form, vigenteHasta: e.target.value })}/></div>
      </div>
      <label className="d-flex gap-2 align-items-center mt-3"><input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })}/> Cupón activo</label>
      <div className="d-flex gap-2 mt-3"><button className="btn btn-luxury" type="submit">{editando ? "Guardar cambios" : "Crear cupón"}</button>{editando && <button className="btn btn-outline-secondary" type="button" onClick={() => { setForm(vacio); setEditando(null); }}>Cancelar</button>}</div>
    </form>
    <div className="admin-panel table-responsive"><table className="table admin-table align-middle"><thead><tr><th>Código</th><th>Descuento</th><th>Inicio</th><th>Vencimiento</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{lista.map(c => <tr key={c.codigo}><td className="fw-bold">{c.codigo}</td><td>{c.descuento}%</td><td>{c.vigenteDesde || "Sin límite"}</td><td>{c.vigenteHasta || "Sin límite"}</td><td>{c.activo ? "Activo" : "Inactivo"}</td><td><div className="d-flex gap-2"><button type="button" className="btn btn-sm btn-outline-light" onClick={() => editar(c)}>Editar</button><button type="button" className="btn btn-sm btn-outline-luxury" onClick={() => alternar(c)}>{c.activo ? "Desactivar" : "Activar"}</button></div></td></tr>)}</tbody></table>{lista.length === 0 && <p>No hay cupones registrados.</p>}</div>
  </section>;
}
