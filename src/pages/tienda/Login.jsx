import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault(); setError(""); setCargando(true);
    try {
      const usuario = await iniciarSesion(correo, password);
      const destino = location.state?.from?.pathname || (usuario.tipo === "Administrador" || usuario.tipo === "Vendedor" ? "/admin" : "/");
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err?.message || "No fue posible iniciar sesión. Revisa tus datos e inténtalo nuevamente.");
    } finally { setCargando(false); }
  }

  return <section className="container py-5" style={{maxWidth: 760}}>
    <div className="text-center mb-4"><span className="text-uppercase tracking-wider text-gold-light small">Bienvenido de vuelta</span><h1 className="display-5 mt-2">Iniciar sesión</h1><p className="text-secondary">Ingresa a tu cuenta Luxury para continuar tu experiencia.</p></div>
    <div className="card luxury-card p-4 p-md-5">
      <form onSubmit={enviar} noValidate>
        <div className="mb-3"><label className="form-label" htmlFor="login-correo">Correo electrónico</label><input id="login-correo" className="form-control form-luxury" type="email" autoComplete="email" required value={correo} onChange={e=>setCorreo(e.target.value)} placeholder="tu@correo.com" /></div>
        <div className="mb-3"><label className="form-label" htmlFor="login-password">Contraseña</label><input id="login-password" className="form-control form-luxury" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Ingresa tu contraseña" /></div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <button className="btn btn-luxury w-100 mt-2" type="submit" disabled={cargando}>{cargando ? "Ingresando…" : "Ingresar"}</button>
      </form>
      <p className="text-center mt-4 mb-0">¿Aún no tienes cuenta? <Link to="/registro" className="text-gold-light">Crear cuenta</Link></p>
    </div>
  </section>;
}
