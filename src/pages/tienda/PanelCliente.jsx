import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ordenesService } from "../../services/ordenesService";
import { usuariosService } from "../../services/usuariosService";
import { formatearPrecio } from "../../utils/formato";

const enlaces = [
  ["", "bi-grid", "Resumen"],
  ["pedidos", "bi-bag-check", "Mis pedidos"],
  ["boletas", "bi-receipt", "Mis boletas"],
  ["perfil", "bi-person-gear", "Mi perfil"],
  ["seguridad", "bi-shield-lock", "Contraseña"],
];
const mensajeError = (e) => e?.cuerpo?.mensaje || "No se pudo completar la operación. Inténtalo nuevamente.";

export default function PanelCliente() {
  const { seccion = "" } = useParams();
  const { usuario, actualizarSesion } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [perfil, setPerfil] = useState(() => ({ nombre: usuario.nombre || "", apellidos: usuario.apellidos || "", correo: usuario.correo || "", region: usuario.region || "", comuna: usuario.comuna || "", direccion: usuario.direccion || "" }));
  const [password, setPassword] = useState({ actual: "", nueva: "", confirmar: "" });
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    let activo = true;
    setCargando(true);
    ordenesService.listar(`?usuarioId=${encodeURIComponent(usuario.id)}&_sort=fecha&_order=desc`)
      .then(data => { if (activo) setOrdenes(data); })
      .catch(() => { if (activo) setError("No se pudo consultar el historial. Comprueba el microservicio de órdenes."); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [usuario.id]);

  async function guardarPerfil(e) {
    e.preventDefault(); setAviso(""); setGuardando(true);
    try {
      const datos = await usuariosService.modificar(usuario.id, perfil);
      actualizarSesion(datos);
      setAviso("Tus datos se actualizaron correctamente.");
    } catch (e) { setAviso(mensajeError(e)); }
    finally { setGuardando(false); }
  }
  async function cambiarPassword(e) {
    e.preventDefault(); setAviso("");
    if (password.nueva !== password.confirmar) { setAviso("Las contraseñas nuevas no coinciden."); return; }
    if (password.nueva.length < 4 || password.nueva.length > 10) { setAviso("La nueva contraseña debe tener entre 4 y 10 caracteres."); return; }
    setGuardando(true);
    try {
      await usuariosService.cambiarPassword(usuario.id, { correo: usuario.correo, passwordActual: password.actual, passwordNueva: password.nueva });
      setPassword({ actual: "", nueva: "", confirmar: "" });
      setAviso("Contraseña actualizada correctamente.");
    } catch(e) { setAviso(e.status === 401 ? "La contraseña actual es incorrecta." : mensajeError(e)); }
    finally { setGuardando(false); }
  }
  const pagadas = ordenes.filter(o => o.estado === "Pagado");
  const pedidos = seccion === "boletas" ? pagadas : ordenes;
  return <main className="container py-5">
    <p className="text-uppercase text-gold tracking-widest mb-2">Luxury Perfumería</p>
    <h1 className="luxury-title mb-4">Mi cuenta</h1>
    <div className="row g-4">
      <aside className="col-lg-3">
        <div className="luxury-card p-3 rounded-3">
          <p className="mb-1 fw-semibold">{usuario.nombre} {usuario.apellidos}</p>
          <p className="text-gold-light small text-break">{usuario.correo}</p>
          <nav aria-label="Menú de mi cuenta" className="nav flex-column gap-1">
            {enlaces.map(([ruta, icono, nombre]) => <NavLink key={ruta} end to={`/mi-cuenta${ruta ? `/${ruta}` : ""}`} className={({isActive}) => `nav-link rounded ${isActive ? "bg-secondary text-white" : "text-gold-light"}`}><i className={`bi ${icono} me-2`} />{nombre}</NavLink>)}
            <Link className="nav-link text-gold-light" to="/wishlist"><i className="bi bi-heart me-2"/>Favoritos</Link>
          </nav>
        </div>
      </aside>
      <section className="col-lg-9" aria-live="polite">
        <div className="luxury-card p-4 rounded-3">
          {aviso && <p role="status" className="alert alert-info">{aviso}</p>}
          {seccion === "" && <>
            <h2 className="h4 luxury-title">Bienvenido, {usuario.nombre}</h2>
            <p>Revisa tus compras, comprobantes y datos personales desde un solo lugar.</p>
            {cargando ? <p>Cargando compras…</p> : <div className="row g-3"><div className="col-sm-6"><div className="border rounded p-3"><span>Pedidos registrados</span><p className="fs-2 mb-0">{ordenes.length}</p></div></div><div className="col-sm-6"><div className="border rounded p-3"><span>Compras pagadas</span><p className="fs-2 mb-0">{pagadas.length}</p></div></div></div>}
            <Link to="/mi-cuenta/pedidos" className="btn btn-luxury mt-4">Ver mis pedidos</Link>
          </>}
          {(seccion === "pedidos" || seccion === "boletas") && <>
            <h2 className="h4 luxury-title">{seccion === "boletas" ? "Mis boletas" : "Mis pedidos"}</h2>
            {cargando ? <p>Cargando pedidos…</p> : error ? <p role="alert">{error}</p> : pedidos.length === 0 ? <p>No tienes {seccion === "boletas" ? "boletas disponibles" : "pedidos registrados"}.</p> :
            <div className="table-responsive"><table className="table table-dark table-hover align-middle"><thead><tr><th>Pedido</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Detalle</th></tr></thead><tbody>{pedidos.map(o => <tr key={o.id}><td>#{o.id}</td><td>{new Date(o.fecha).toLocaleDateString("es-CL")}</td><td>{o.estado}</td><td>{formatearPrecio(o.total)}</td><td><details><summary>Ver productos</summary><ul>{o.items?.map((item,i) => <li key={i}>{item.cantidad} × {item.nombre}</li>)}</ul>{o.estado === "Pagado" && <p>El comprobante PDF fue enviado al correo indicado al comprar: {o.cliente?.correo}.</p>}</details></td></tr>)}</tbody></table></div>}
            {seccion === "boletas" && <p className="small text-gold-light">La descarga directa del PDF desde la cuenta requiere autenticar la API de órdenes. Por ahora puedes recuperarlo desde el correo de confirmación.</p>}
          </>}
          {seccion === "perfil" && <><h2 className="h4 luxury-title">Actualizar mis datos</h2><form onSubmit={guardarPerfil} className="row g-3">{[["nombre","Nombre"],["apellidos","Apellidos"],["correo","Correo electrónico"],["region","Región"],["comuna","Comuna"],["direccion","Dirección"]].map(([clave,etiqueta])=><div key={clave} className="col-md-6"><label className="form-label" htmlFor={`cuenta-${clave}`}>{etiqueta}</label><input required={["nombre","apellidos","correo"].includes(clave)} type={clave === "correo" ? "email" : "text"} className="form-control" id={`cuenta-${clave}`} value={perfil[clave]} onChange={e=>setPerfil(v=>({...v,[clave]:e.target.value}))}/></div>)}<div className="col-12"><button className="btn btn-luxury" disabled={guardando}>Guardar cambios</button></div></form></>}
          {seccion === "seguridad" && <><h2 className="h4 luxury-title">Cambiar contraseña</h2><p className="small text-gold-light">Escribe tu contraseña actual. La nueva debe tener entre 4 y 10 caracteres, según las reglas vigentes de registro.</p><form onSubmit={cambiarPassword} className="row g-3">{[["actual","Contraseña actual"],["nueva","Nueva contraseña"],["confirmar","Confirmar nueva contraseña"]].map(([clave,nombre])=><div className="col-12" key={clave}><label htmlFor={`password-${clave}`} className="form-label">{nombre}</label><input className="form-control" id={`password-${clave}`} type="password" required autoComplete={clave === "actual" ? "current-password" : "new-password"} value={password[clave]} onChange={e=>setPassword(v=>({...v,[clave]:e.target.value}))}/></div>)}<div><button className="btn btn-luxury" disabled={guardando}>Actualizar contraseña</button></div></form></>}
          {!enlaces.some(([ruta]) => ruta === seccion) && <p>Sección no encontrada. <Link to="/mi-cuenta">Volver a mi cuenta</Link>.</p>}
        </div>
      </section>
    </div>
  </main>;
}
