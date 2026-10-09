import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordenesService } from "../../services/ordenesService";
import { productosService } from "../../services/productosService";
import { usuariosService } from "../../services/usuariosService";
import { formatearPrecio } from "../../utils/formato";

const vacios = { ordenes: [], productos: [], usuarios: [] };

export default function DashboardAdmin() {
  const [datos, setDatos] = useState(vacios);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    Promise.all([
      ordenesService.listar(),
      productosService.listar(),
      usuariosService.listar(),
    ]).then(([ordenes, productos, usuarios]) => {
      if (activo) setDatos({ ordenes, productos, usuarios });
    }).catch(() => {
      if (activo) setError("No se pudieron cargar los datos del panel. Comprueba que la API esté iniciada.");
    }).finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const ventas = datos.ordenes.filter((orden) => ["Pagado", "Completado", "Aprobado"].includes(orden.estado));
  const totalVentas = ventas.reduce((total, orden) => total + Number(orden.total || 0), 0);
  const pendientes = datos.ordenes.filter((orden) => ["Pendiente", "En preparación"].includes(orden.estado));
  const criticos = datos.productos.filter((producto) => Number(producto.stock) <= Number(producto.stockCritico ?? 2));
  const recientes = [...datos.ordenes].sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0)).slice(0, 5);

  return <section className="admin-page container-fluid py-2">
    <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div><span className="admin-eyebrow">LUXURY · ADMINISTRACIÓN</span><h1 className="luxury-title display-5 mb-1">Dashboard</h1><p className="text-gold-light mb-0">Resumen general de tu perfumería.</p></div>
      <Link to="/admin/ordenes" className="btn btn-luxury"><i className="bi bi-receipt me-2"/>Ver órdenes</Link>
    </div>
    {error && <div className="alert alert-warning" role="alert">{error}</div>}
    {cargando ? <p role="status">Cargando resumen del negocio…</p> : <>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3"><article className="admin-stat-card"><span className="admin-stat-icon"><i className="bi bi-currency-dollar"/></span><p>Ventas registradas</p><strong>{formatearPrecio(totalVentas)}</strong><small>{ventas.length} órdenes pagadas</small></article></div>
        <div className="col-12 col-sm-6 col-xl-3"><article className="admin-stat-card"><span className="admin-stat-icon"><i className="bi bi-receipt"/></span><p>Órdenes totales</p><strong>{datos.ordenes.length}</strong><small>{pendientes.length} pendientes de gestión</small></article></div>
        <div className="col-12 col-sm-6 col-xl-3"><article className="admin-stat-card"><span className="admin-stat-icon"><i className="bi bi-droplet"/></span><p>Productos activos</p><strong>{datos.productos.length}</strong><small>{criticos.length} con stock crítico</small></article></div>
        <div className="col-12 col-sm-6 col-xl-3"><article className="admin-stat-card"><span className="admin-stat-icon"><i className="bi bi-people"/></span><p>Usuarios registrados</p><strong>{datos.usuarios.length}</strong><small>Clientes y equipo Luxury</small></article></div>
      </div>
      <div className="row g-4">
        <div className="col-12 col-xl-8"><section className="admin-panel h-100"><div className="d-flex justify-content-between align-items-center gap-2 mb-3"><h2 className="h4 luxury-title mb-0">Órdenes recientes</h2><Link to="/admin/ordenes" className="admin-text-link">Ver todas <i className="bi bi-arrow-right"/></Link></div>
          {recientes.length ? <div className="table-responsive"><table className="table admin-table align-middle mb-0"><thead><tr><th>Orden</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th className="text-end">Total</th></tr></thead><tbody>{recientes.map((orden) => <tr key={orden.id}><td><Link to={`/admin/ordenes/${orden.id}`} className="admin-text-link">#{orden.id}</Link></td><td>{orden.cliente?.nombre || "Cliente"} {orden.cliente?.apellidos || ""}</td><td>{orden.fecha ? new Date(orden.fecha).toLocaleDateString("es-CL") : "—"}</td><td><span className={`admin-status ${String(orden.estado).toLowerCase().replaceAll(" ", "-")}`}>{orden.estado || "Sin estado"}</span></td><td className="text-end text-gold">{formatearPrecio(orden.total)}</td></tr>)}</tbody></table></div> : <p className="text-gold-light mb-0">Todavía no hay órdenes registradas.</p>}
        </section></div>
        <div className="col-12 col-xl-4"><section className="admin-panel h-100"><h2 className="h4 luxury-title mb-3">Atención de inventario</h2>{criticos.length ? <ul className="admin-critical-list list-unstyled mb-0">{criticos.slice(0, 6).map((producto) => <li key={producto.id}><span><strong>{producto.nombre}</strong><small>{producto.marca}</small></span><span className="admin-stock-warning">{producto.stock} uds.</span></li>)}</ul> : <p className="text-gold-light mb-0">No hay productos bajo el umbral de stock crítico.</p>}<Link to="/admin/productos/criticos" className="btn btn-outline-light btn-sm mt-3">Gestionar inventario</Link></section></div>
      </div>
    </>}
  </section>;
}
