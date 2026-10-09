import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ordenesService } from "../../services/ordenesService";
import { formatearPrecio } from "../../utils/formato";

export default function OrdenesAdmin() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("Todas");

  useEffect(() => {
    let activo = true;
    ordenesService.listar("?_sort=fecha&_order=desc").then((data) => { if (activo) setOrdenes(data); })
      .catch(() => { if (activo) setError("No fue posible cargar las órdenes. Verifica la conexión con la API."); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const estados = useMemo(() => ["Todas", ...new Set(ordenes.map((orden) => orden.estado).filter(Boolean))], [ordenes]);
  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return ordenes.filter((orden) => {
      const cliente = `${orden.cliente?.nombre || ""} ${orden.cliente?.apellidos || ""} ${orden.cliente?.correo || ""}`.toLowerCase();
      return (estado === "Todas" || orden.estado === estado) && (!texto || String(orden.id).toLowerCase().includes(texto) || cliente.includes(texto));
    });
  }, [ordenes, busqueda, estado]);

  return <section className="admin-page container-fluid py-2">
    <div className="mb-4"><span className="admin-eyebrow">VENTAS Y DESPACHOS</span><h1 className="luxury-title display-5 mb-1">Órdenes</h1><p className="text-gold-light mb-0">Consulta las compras y accede a la boleta de cada pedido.</p></div>
    <section className="admin-panel">
      <div className="row g-3 mb-4"><div className="col-12 col-lg-7"><label htmlFor="buscar-orden" className="form-label">Buscar orden o cliente</label><div className="input-group"><span className="input-group-text admin-input-addon"><i className="bi bi-search"/></span><input id="buscar-orden" className="form-control admin-input" placeholder="Número, nombre o correo" value={busqueda} onChange={(event) => setBusqueda(event.target.value)}/></div></div><div className="col-12 col-lg-5"><label htmlFor="filtrar-estado" className="form-label">Filtrar por estado</label><select id="filtrar-estado" className="form-select admin-input" value={estado} onChange={(event) => setEstado(event.target.value)}>{estados.map((opcion) => <option key={opcion}>{opcion}</option>)}</select></div></div>
      {error && <div className="alert alert-warning" role="alert">{error}</div>}
      {cargando ? <p role="status">Cargando órdenes…</p> : filtradas.length ? <div className="table-responsive"><table className="table admin-table align-middle"><thead><tr><th>N.º orden</th><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Estado</th><th className="text-end">Total</th><th className="text-end">Boleta</th></tr></thead><tbody>{filtradas.map((orden) => <tr key={orden.id}><td className="fw-semibold">#{orden.id}</td><td>{orden.fecha ? new Date(orden.fecha).toLocaleDateString("es-CL") : "—"}</td><td>{orden.cliente?.nombre || "—"} {orden.cliente?.apellidos || ""}<small className="d-block text-secondary">{orden.cliente?.correo || ""}</small></td><td>{orden.items?.reduce((n, item) => n + Number(item.cantidad || 0), 0) || 0}</td><td><span className={`admin-status ${String(orden.estado || "").toLowerCase().replaceAll(" ", "-")}`}>{orden.estado || "Sin estado"}</span></td><td className="text-end text-gold">{formatearPrecio(orden.total)}</td><td className="text-end"><Link className="btn btn-sm btn-luxury" to={`/admin/ordenes/${orden.id}`} aria-label={`Ver boleta de la orden ${orden.id}`}><i className="bi bi-receipt me-1"/>Boleta</Link></td></tr>)}</tbody></table></div> : <div className="admin-empty-state"><i className="bi bi-receipt"/><h2 className="h5 luxury-title">No hay órdenes para mostrar</h2><p className="mb-0">Prueba cambiando la búsqueda o el estado seleccionado.</p></div>}
      {!cargando && <div className="d-flex justify-content-between flex-wrap gap-2 mt-3 text-gold-light small"><span>{filtradas.length} de {ordenes.length} órdenes</span><span>Total listado: {formatearPrecio(filtradas.reduce((total, orden) => total + Number(orden.total || 0), 0))}</span></div>}
    </section>
  </section>;
}
