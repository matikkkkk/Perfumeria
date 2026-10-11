import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoriasService } from "../../services/categoriasService";
import { productosService } from "../../services/productosService";

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargarDatos() {
    setCargando(true); setError("");
    try {
      const [listaCategorias, listaProductos] = await Promise.all([
        categoriasService.listar(), productosService.listar(),
      ]);
      setCategorias(listaCategorias); setProductos(listaProductos);
    } catch { setError("No se pudieron cargar las categorías. Verifica que la API esté iniciada."); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargarDatos(); }, []);

  async function eliminar(categoria) {
    const tieneProductos = productos.some((p) => p.categoria === categoria.id || p.categoria === categoria.nombre);
    if (tieneProductos) { setError("No puedes eliminar esta categoría porque tiene productos asociados."); return; }
    if (!window.confirm(`¿Eliminar la categoría ${categoria.nombre}?`)) return;
    try {
      await categoriasService.eliminar(categoria.id);
      setCategorias((actuales) => actuales.filter((c) => c.id !== categoria.id));
      setMensaje("Categoría eliminada correctamente."); setError("");
    } catch { setError("No fue posible eliminar la categoría."); }
  }
  const filtradas = categorias.filter((c) => `${c.nombre} ${c.descripcion || ""}`.toLowerCase().includes(busqueda.toLowerCase()));
  const cantidadProductos = (categoria) => productos.filter((p) => p.categoria === categoria.id || p.categoria === categoria.nombre).length;

  return <section className="admin-page container-fluid py-2">
    <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4"><div><span className="admin-eyebrow d-block">ADMINISTRACIÓN DEL CATÁLOGO</span><h1 className="luxury-title display-5">Categorías</h1><p className="text-gold-light mb-0">Organiza las familias de productos de Luxury.</p></div><Link className="btn btn-luxury" to="/admin/categorias/nueva"><i className="bi bi-plus-lg me-2"/>Nueva categoría</Link></div>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}{mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
    <div className="admin-panel"><div className="row align-items-center g-3 mb-3"><div className="col-md-7"><label className="form-label" htmlFor="buscarCategoria">Buscar categoría</label><input id="buscarCategoria" className="form-control" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Nombre o descripción"/></div><div className="col-md-5 text-md-end"><span className="text-gold-light">Categorías registradas: <strong>{categorias.length}</strong></span></div></div>
    {cargando ? <p role="status">Cargando categorías…</p> : filtradas.length === 0 ? <p>No hay categorías que coincidan con la búsqueda.</p> : <div className="table-responsive"><table className="table admin-table align-middle"><thead><tr><th>Nombre</th><th>Descripción</th><th className="text-end">Productos</th><th className="text-end">Acciones</th></tr></thead><tbody>{filtradas.map((c) => <tr key={c.id}><td className="fw-semibold">{c.nombre}</td><td>{c.descripcion || "Sin descripción"}</td><td className="text-end">{cantidadProductos(c)}</td><td className="text-end text-nowrap"><Link className="btn btn-sm btn-outline-light me-2" to={`/admin/categorias/${c.id}/editar`} aria-label={`Editar ${c.nombre}`}><i className="bi bi-pencil"/></Link><button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c)} aria-label={`Eliminar ${c.nombre}`}><i className="bi bi-trash"/></button></td></tr>)}</tbody></table></div>}</div>
  </section>;
}
