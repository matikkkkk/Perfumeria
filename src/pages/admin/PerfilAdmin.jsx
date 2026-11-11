import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usuariosService } from "../../services/usuariosService";

export default function PerfilAdmin() {
  const { usuario, actualizarSesion } = useAuth();
  const [formulario, setFormulario] = useState(() => ({ nombre: usuario?.nombre || "", apellidos: usuario?.apellidos || "", correo: usuario?.correo || "", region: usuario?.region || "", comuna: usuario?.comuna || "", direccion: usuario?.direccion || "" }));
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cambiar = (event) => setFormulario((actual) => ({ ...actual, [event.target.name]: event.target.value }));
  const enviar = async (event) => {
    event.preventDefault(); setMensaje(""); setError("");
    if (!formulario.nombre.trim() || !formulario.apellidos.trim() || !formulario.correo.trim()) {
      setError("Nombre, apellidos y correo son obligatorios."); return;
    }
    setGuardando(true);
    try {
      const cambios = { ...formulario, nombre: formulario.nombre.trim(), apellidos: formulario.apellidos.trim(), correo: formulario.correo.trim().toLowerCase() };
      // PATCH evita reemplazar campos del usuario que no se editan desde el perfil (por ejemplo, password y tipo).
      await usuariosService.modificar(usuario.id || usuario.run, cambios);
      actualizarSesion(cambios);
      setMensaje("Tus datos se guardaron correctamente.");
    } catch {
      setError("No se pudieron guardar los cambios. Revisa la conexión con la API y vuelve a intentarlo.");
    } finally { setGuardando(false); }
  };

  return <section className="admin-page container-fluid py-2">
    <div className="mb-4"><span className="admin-eyebrow">CUENTA Y PREFERENCIAS</span><h1 className="luxury-title display-5 mb-1">Mi perfil</h1><p className="text-gold-light mb-0">Mantén actualizados tus datos de contacto y despacho.</p></div>
    <div className="row g-4"><div className="col-12 col-xl-4"><section className="admin-profile-card text-center"><div className="admin-avatar mx-auto mb-3">{(usuario?.nombre || "U").charAt(0).toUpperCase()}{(usuario?.apellidos || "").charAt(0).toUpperCase()}</div><h2 className="h4 luxury-title">{usuario?.nombre} {usuario?.apellidos}</h2><p className="text-gold-light mb-3">{usuario?.correo}</p><span className="admin-role-pill"><i className="bi bi-shield-check me-2"/>{usuario?.tipo || "Usuario"}</span><hr className="border-secondary my-4"/><p className="small text-secondary mb-0">Identificador de cuenta</p><strong>{usuario?.run || usuario?.id || "No disponible"}</strong></section></div>
      <div className="col-12 col-xl-8"><section className="admin-panel"><h2 className="h4 luxury-title mb-4">Información personal</h2>{mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}{error && <div className="alert alert-danger" role="alert">{error}</div>}<form onSubmit={enviar}><div className="row g-3"><div className="col-12 col-md-6"><label htmlFor="perfil-nombre" className="form-label">Nombre *</label><input id="perfil-nombre" name="nombre" className="form-control admin-input" value={formulario.nombre} onChange={cambiar} required/></div><div className="col-12 col-md-6"><label htmlFor="perfil-apellidos" className="form-label">Apellidos *</label><input id="perfil-apellidos" name="apellidos" className="form-control admin-input" value={formulario.apellidos} onChange={cambiar} required/></div><div className="col-12"><label htmlFor="perfil-correo" className="form-label">Correo electrónico *</label><input id="perfil-correo" name="correo" type="email" className="form-control admin-input" value={formulario.correo} onChange={cambiar} required/></div><div className="col-12 col-md-6"><label htmlFor="perfil-region" className="form-label">Región</label><input id="perfil-region" name="region" className="form-control admin-input" value={formulario.region} onChange={cambiar}/></div><div className="col-12 col-md-6"><label htmlFor="perfil-comuna" className="form-label">Comuna</label><input id="perfil-comuna" name="comuna" className="form-control admin-input" value={formulario.comuna} onChange={cambiar}/></div><div className="col-12"><label htmlFor="perfil-direccion" className="form-label">Dirección</label><input id="perfil-direccion" name="direccion" className="form-control admin-input" value={formulario.direccion} onChange={cambiar}/></div></div><div className="d-flex justify-content-end mt-4"><button className="btn btn-luxury" type="submit" disabled={guardando}>{guardando ? <><span className="spinner-border spinner-border-sm me-2"/>Guardando…</> : <><i className="bi bi-check2-circle me-2"/>Guardar cambios</>}</button></div></form></section></div></div>
  </section>;
}
