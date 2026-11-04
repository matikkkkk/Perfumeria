import { useCallback, useEffect, useState } from "react";
import { AdminTableSkeleton } from "../../components/skeleton/LuxurySkeletons";
import { cuponesService } from "../../services/cuponesService";

const formularioVacio = () => ({ codigo: "", descuento: 10, activo: true, vigenteDesde: "", vigenteHasta: "" });
const preparar = (cupon) => ({
  ...cupon,
  codigo: cupon.codigo.trim().toUpperCase(),
  vigenteDesde: cupon.vigenteDesde || null,
  vigenteHasta: cupon.vigenteHasta || null,
});

export default function CuponesAdmin() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(formularioVacio);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesando, setProcesando] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await cuponesService.listar();
      setLista(Array.isArray(datos) ? datos : []);
    } catch {
      setError("No se pudieron consultar los cupones. Comprueba la conexión con la API.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function guardar(e) {
    e.preventDefault();
    if (guardando) return;
    setError("");
    setMensaje("");

    if (form.vigenteDesde && form.vigenteHasta && form.vigenteDesde > form.vigenteHasta) {
      setError("La fecha final debe ser igual o posterior a la inicial.");
      return;
    }

    setGuardando(true);
    try {
      const datos = preparar(form);
      if (editando !== null) await cuponesService.actualizar(editando, datos);
      else await cuponesService.crear(datos);
      setForm(formularioVacio());
      setEditando(null);
      await cargar();
      setMensaje(editando !== null ? "Cupón actualizado correctamente." : "Cupón creado correctamente.");
    } catch (err) {
      setError(err.status === 409 ? "Este código ya existe." : err.cuerpo?.mensaje || "No se pudo guardar el cupón.");
    } finally {
      setGuardando(false);
    }
  }

  async function alternar(cupon) {
    if (procesando) return;
    setProcesando(cupon.codigo);
    setError("");
    setMensaje("");
    try {
      await cuponesService.actualizar(cupon.codigo, preparar({ ...cupon, activo: !cupon.activo }));
      await cargar();
      setMensaje(`Cupón ${cupon.activo ? "desactivado" : "activado"} correctamente.`);
    } catch (err) {
      setError(err.cuerpo?.mensaje || "No se pudo cambiar el estado del cupón.");
    } finally {
      setProcesando(null);
    }
  }

  function editar(cupon) {
    setEditando(cupon.codigo);
    setForm({ ...cupon, vigenteDesde: cupon.vigenteDesde || "", vigenteHasta: cupon.vigenteHasta || "" });
    setMensaje("");
    setError("");
    document.getElementById("codigoCupon")?.focus();
  }

  return (
    <section className="admin-page container-fluid py-2">
      <span className="admin-eyebrow">PROMOCIONES</span>
      <h1 className="luxury-title display-5 mb-3">Gestión de cupones</h1>
      <p className="text-gold-light">Crea descuentos y controla cuándo pueden aplicarse en el carrito.</p>

      {error && <div role="alert" className="alert alert-danger d-flex flex-wrap align-items-center gap-2">{error}<button type="button" className="btn btn-sm btn-outline-danger" onClick={cargar} disabled={cargando}>Reintentar carga</button></div>}
      {mensaje && <p role="status" className="alert alert-success">{mensaje}</p>}

      <form className="admin-panel mb-4" onSubmit={guardar} aria-busy={guardando}>
        <h2 className="h5 luxury-title">{editando !== null ? `Editar ${editando}` : "Nuevo cupón"}</h2>
        <div className="row g-3">
          <div className="col-md-4"><label className="form-label" htmlFor="codigoCupon">Código</label><input id="codigoCupon" className="form-control" required minLength={3} maxLength={40} pattern="[A-Za-z0-9_-]{3,40}" disabled={editando !== null || guardando} value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })} /></div>
          <div className="col-md-2"><label className="form-label" htmlFor="descuentoCupon">Descuento (%)</label><input id="descuentoCupon" className="form-control" type="number" min="1" max="90" required disabled={guardando} value={form.descuento} onChange={(e) => setForm({ ...form, descuento: e.target.value === "" ? "" : Number(e.target.value) })} /></div>
          <div className="col-md-3"><label className="form-label" htmlFor="inicioCupon">Válido desde</label><input id="inicioCupon" className="form-control" type="date" disabled={guardando} value={form.vigenteDesde} onChange={(e) => setForm({ ...form, vigenteDesde: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label" htmlFor="finCupon">Válido hasta</label><input id="finCupon" className="form-control" type="date" disabled={guardando} min={form.vigenteDesde || undefined} value={form.vigenteHasta} onChange={(e) => setForm({ ...form, vigenteHasta: e.target.value })} /></div>
        </div>
        <label className="d-flex gap-2 align-items-center mt-3"><input type="checkbox" disabled={guardando} checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} /> Cupón activo</label>
        <div className="d-flex gap-2 mt-3 flex-wrap"><button className="btn btn-luxury" type="submit" disabled={guardando}>{guardando ? "Guardando…" : editando !== null ? "Guardar cambios" : "Crear cupón"}</button>{editando !== null && <button className="btn btn-outline-secondary" type="button" disabled={guardando} onClick={() => { setForm(formularioVacio()); setEditando(null); }}>Cancelar</button>}</div>
      </form>

      {cargando ? <AdminTableSkeleton filas={5} columnas={6} showFilters={false} /> : (
        <div className="admin-panel">
          <h2 className="h5 luxury-title mb-3">Cupones registrados</h2>
          {error && lista.length === 0 ? <p>No se puede mostrar el listado hasta recuperar la conexión.</p> : lista.length === 0 ? <p>No hay cupones registrados.</p> : (
            <div className="table-responsive">
              <table className="table admin-table align-middle">
                <thead><tr><th>Código</th><th>Descuento</th><th>Inicio</th><th>Vencimiento</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {lista.map((c) => (
                    <tr key={c.codigo}>
                      <td className="fw-bold">{c.codigo}</td>
                      <td>{c.descuento}%</td>
                      <td>{c.vigenteDesde || "Sin límite"}</td>
                      <td>{c.vigenteHasta || "Sin límite"}</td>
                      <td><span className={`admin-status ${c.activo ? "pagada" : "pendiente"}`}>{c.activo ? "Activo" : "Inactivo"}</span></td>
                      <td><div className="d-flex flex-wrap gap-2"><button type="button" className="btn btn-sm btn-outline-light" disabled={!!procesando || guardando} onClick={() => editar(c)}>Editar</button><button type="button" className="btn btn-sm btn-outline-luxury" disabled={!!procesando || guardando} onClick={() => alternar(c)}>{procesando === c.codigo ? "Procesando…" : c.activo ? "Desactivar" : "Activar"}</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
